const express = require("express");
const { OrderModel } = require("../models/order.model");
const { v4: uuidv4 } = require("uuid");
const { instance } = require("../configs/razorPayInstance");


const orderRouter = express.Router();
require('dotenv').config();

// Get all orders
orderRouter.get("/get", async (req, res) => {
    try {
        const orders = await OrderModel.find();
        res.status(200).send(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});




// Update an order by ID
orderRouter.patch("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderModel.findByIdAndUpdate(id, req.body);

        if (!order) {
            return res.status(404).send({ msg: "Order not found" });
        }

        res.status(200).send({ msg: "Order details updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});

// Delete an order by ID
orderRouter.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderModel.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).send({ msg: "Order not found" });
        }

        res.status(200).send({ msg: "Order deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
    }
});

// POST /orders
orderRouter.post('/payment', async (req, res) => {
    const amount = req.body.amount || 300 // this is the amount that we will get from the checkout page 
    // const recieptId = uuidv4() + "orderId"
    try {
        const url = 'https://api.razorpay.com/v1/orders';
        const requestData = {
            amount: amount * 100,
            currency: 'INR',
            receipt: 'fdf34d'
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic fZPHlWVU8LY89D2QITZ52Aps'
            },
            body: JSON.stringify(requestData)
        };

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data = await response.json();
            // Process the response data
            console.log(data);
        } catch (error) {
            console.error(error);
        }


        const orderId = razorpayResponse.data.id;
        // You can handle the order ID and perform further actions here
        instance.orders.create(options, function (err, order) {
            console.log(order);
        });
        res.status(200).json({ orderId });
    } catch (error) {
        // Handle any errors that occur during the API request
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Add a new order
// using this route to create an order for my payment 
orderRouter.post('/createOrderId', async (req, res) => {
    const amount = req.body.amount || 300; // this is the amount that we will get from the checkout page
    console.log("🚀 ~ file: order.routes.js:109 ~ orderRouter.post ~ amount:", amount)
    var receiptId = uuidv4()
    receiptId = receiptId.slice(-10);
    console.log("🚀 ~ file: order.routes.js:110 ~ orderRouter.post ~ recieptId:", receiptId)

    var options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: receiptId,
    };
    try {
        instance.orders.create(options, function (err, order) {
            console.log("🚀 ~ file: order.routes.js:120 ~ order:", order)
            res.status(200).send({ orderId: order.id, order })
        });
    } catch (error) {
        console.log("🚀 ~ file: order.routes.js:119 ~ orderRouter.post ~ error:", error)

    }


});

module.exports = {
    orderRouter
};
