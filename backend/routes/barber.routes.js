const express = require("express");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { BarberModel } = require("../models/barber.model");
const { redisClient } = require("../configs/redis");
const { BlacklistModel } = require("../models/blacklist.model");
const store = require('store'); // for cross browser local storage
const { uuidv4 } = require("../configs/uuidGenerator")
const { authMiddleware } = require("../middlewares/authMiddleware.middleware");
// const cors =  require("cors")


require("dotenv").config();

const barberRouter = express();

barberRouter.use(express.json());

//register route
barberRouter.post("/register", async (req, res) => {
    const barberData = req.body;
    // console.log(barberData)
    try {
        req.body.uniqueBarberId = uuidv4();
        let alreadyPresent = await BarberModel.findOne({ email: barberData.email });
        if (alreadyPresent) {
            res.status(400).send({ msg: "barber is already present please use a different email" })
        }
        else {
            const hash = bcrypt.hashSync(barberData.password, 4);
            barberData.password = hash;
            const user = new BarberModel(barberData);
            await user.save();
            res.status(200).send({ msg: "new barber addded" })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "cannot add new barber " })
    }
})

//login route 

barberRouter.post("/login", async (req, res) => {
    const user = req.body;
    // console.log(user);
    try {
        const myUser = await BarberModel.findOne({ email: user.email })
        console.log("🚀 ~ file: user.routes.js:34 ~ barberRouter.post ~ myUser:", myUser)
        try {
            if (myUser) {
                bcrypt.compare(user.password, myUser.password, function (err, result) { // eslint-disable-line no-unused-vars
                    if (result) {
                        // temporarily using expire time *60 for usability. Ignore it if I forgot to remove the extra 60
                        var token = jwt.sign({ userId: myUser._id }, process.env.TOKEN_SECRET, { expiresIn: "7d" });
                        var refreshToken = jwt.sign({ userId: myUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24d" });
                        //using redis for storing the tokens //working re
                        redisClient.set("jwttoken", token)
                        //using local storage npm package // ! not working
                        // store.set('username', { name:myUser?.name })
                        redisClient.set("refreshtoken", refreshToken)
                        store.set("barberUser", myUser);
                        res.status(200).send({ msg: "barber logged in", token, refreshToken, usernameforchat: myUser.name, userId: myUser._id })
                    }
                    res.status(400).send({ msg: "wrong password" })
                });
            }
            else {
                res.status(400).send({ msg: "barber not found " })
            }
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message)
        }
    } catch (error) {
        console.log("🚀 ~ file: user.routes.js:54 ~ barberRouter.post ~ error:", error)
        console.log(error)
    }
})



// logout 
barberRouter.post("/logout", authMiddleware, async (req, res) => {
    const token = await redisClient.get("jwttoken")
    // console.log("🚀 ~ file: user.routes.js:66 ~ barberRouter.post ~ token:", token)
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ2aXNoYW50QGdtYWlsLmNvbSIsImlhdCI6MTY4MzAyMTkxMH0._0qh7J3lvLuhBDckqEyW5sRtLaOSdWa2rm0rELhc12E"

    try {
        const blacklist = new BlacklistModel({ token: token })
        await blacklist.save();
        store.remove('barberUser');
        res.status(200).send({ msg: "logged out " })
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "cannot logout " })
    }
})

// route to get new token using refresh token 
// we will hit this route from the frontend 
barberRouter.get("/newtoken", authMiddleware, (req, res) => {
    // console.log("new route hit ")
    const refreshToken = req.headers.authorization;
    console.log("🚀 ~ file: user.routes.js:74 ~ barberRouter.get ~ refreshToken:", refreshToken)

    try {
        var decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (decoded) {
            var token = jwt.sign({ userId: decoded.userId }, process.env.TOKEN_SECRET, { expiresIn: "7d" });
            redisClient.set("jwttoken", token)
            res.send({ msg: "New token generated ", token })
        }

    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

// patch route 
barberRouter.patch("/update/:id", authMiddleware, async (req, res) => {
    let { id } = req.params;
    console.log("🚀 ~ file: user.routes.js:114 ~ barberRouter.patch ~ id:", id)
    try {
        const user = await BarberModel.findByIdAndUpdate(id);

        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        res.status(200).send({ msg: "user details updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});

// get all barbers 
// GET route to fetch all barbers
barberRouter.get("/get", async (req, res) => {
    try {
      const barbers = await BarberModel.find();
      res.status(200).json(barbers);
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "Internal server error" });
    }
  });
  

module.exports = {
    barberRouter
}
