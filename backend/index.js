const express = require('express');
const app = express();

const { connection } = require('./configs/dbConnection');
const { userRouter } = require('./routes/user.routes');
const { authMiddleware } = require('./middlewares/authMiddleware.middleware');
const { barberRouter } = require('./routes/barber.routes');
const cors = require('cors');
const { hairStyleRouter } = require('./routes/hairstyle.routes');
const { hairStyleBookingRouter } = require('./routes/hairstyleBooking.routes');
const { productsRouter } = require('./routes/hairProducts.routes');
const { orderRouter } = require('./routes/order.routes');
require("dotenv").config();

// ^ middlewares 
app.use(cors())
app.use(express.json())
app.use("/user", userRouter)
app.use("/barber", barberRouter)
// ! auth middle ware commented temporarily
// todo uncomment it
// app.use(authMiddleware) 
app.use("/hairstyle", hairStyleRouter)
app.use("/hairstylebooking", hairStyleBookingRouter)
app.use("/product", productsRouter)
app.use("/order", orderRouter)
hairStyleRouter
// app.use("/auth", authRoute)

// after user have logged in , we will use the auth middleware 
//above userRouter only contains login register and logout
// app.use(authMiddleware);


//home route
app.get("/", async (req, res) => {
    try {
        res.send({ msg: "home route" })
        //  res.render("index.ejs")
    } catch (err) { console.log(err) }
})


app.listen(process.env.PORT, async () => {
    try {
        console.log("checking redis , db and server status")
        await connection;
        console.log("connected to db ")

    }
    catch (err) {
        console.log("error | connection", err)
    }
    console.log(`server started @ http://localhost:${process.env.PORT}`)
})















