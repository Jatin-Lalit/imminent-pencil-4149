const express = require("express");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { redisClient } = require("../configs/redis");
const { BlacklistModel } = require("../models/blacklist.model");
const store = require('store'); // for cross browser local storage
const { uuidv4 } = require("../configs/uuidGenerator")
const { authMiddleware } = require("../middlewares/authMiddleware.middleware");
const { HairStyleBookingModel } = require("../models/hairstyleBooking.model");
// const cors =  require("cors")


require("dotenv").config();

const hairStyleBookingRouter = express();

hairStyleBookingRouter.use(express.json());


//get route 
hairStyleBookingRouter.get("/get", async (req, res) => {
    try {
        const hairstyle = await HairStyleBookingModel.find();
        res.status(200).send(hairstyle);
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});
//register route
hairStyleBookingRouter.post("/add", async (req, res) => {
    const userData = req.body;
    // console.log(userData)
    try {
        req.body.bookingUniqueId = uuidv4();
        const hairstyle = new HairStyleBookingModel(userData);
        await hairstyle.save();
        res.status(200).send({ msg: "new booking addded" })

    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "cannot add new booking " })
    }
})


// patch route 
hairStyleBookingRouter.patch("/update/:id", async (req, res) => {
    let { id } = req.params;
    console.log("🚀 ~ file: user.routes.js:114 ~ userRouter.patch ~ id:", id)
    try {
        const booking = await HairStyleBookingModel.findByIdAndUpdate(id, req.body);

        if (!booking) {
            return res.status(404).send({ msg: "booking not found" });
        }

        res.status(200).send({ msg: "booking details updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});

// delete booking by id 
// Delete a booking by ID
hairStyleBookingRouter.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await HairStyleBookingModel.findByIdAndDelete(id);

        if (!booking) {
            return res.status(404).send({ msg: "Booking not found" });
        }

        res.status(200).send({ msg: "Booking deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});


module.exports = {
    hairStyleBookingRouter
}
