const express = require("express");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { redisClient } = require("../configs/redis");
const { BlacklistModel } = require("../models/blacklist.model");
const store = require('store'); // for cross browser local storage
const { uuidv4 } = require("../configs/uuidGenerator")
const { authMiddleware } = require("../middlewares/authMiddleware.middleware");
const { HairStyleModel } = require("../models/hairstyle.model");
// const cors =  require("cors")


require("dotenv").config();

const hairStyleRouter = express();

hairStyleRouter.use(express.json());

//register route
hairStyleRouter.post("/add", async (req, res) => {
    const userData = req.body;
    // console.log(userData)
    try {
        req.body.uniqueHairstyleId = uuidv4();
        let alreadyPresent = await HairStyleModel.findOne({ hairstyleName: userData.hairstyleName });
        if (alreadyPresent) {
            res.status(400).send({ msg: "hairstyle already added" })
        }
        else {
            const hairstyle = new HairStyleModel(userData);
            await hairstyle.save();
            res.status(200).send({ msg: "new hairstyle addded" })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "cannot add new hairstyle " })
    }
})


// patch route 
hairStyleRouter.patch("/update/:id", async (req, res) => {
    let { id } = req.params;
    console.log("🚀 ~ file: user.routes.js:114 ~ userRouter.patch ~ id:", id)
    try {
        const hairstyle = await HairStyleModel.findByIdAndUpdate(id,req.body);

        if (!hairstyle) {
            return res.status(404).send({ msg: "hairstyle not found" });
        }

        res.status(200).send({ msg: "hairstyle details updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});

module.exports = {
    hairStyleRouter
}
