const express = require("express");
const { OrderModel } = require("../models/order.model");
const { v4: uuidv4 } = require("uuid");

const orderRouter = express.Router();

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

// Add a new order
orderRouter.post("/add", async (req, res) => {
    try {
        const orderData = req.body;
        orderData.orderNumber = uuidv4();

        const order = new OrderModel(orderData);
        await order.save();
        res.status(200).send({ msg: "New order added" });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Cannot add new order" });
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

module.exports = {
    orderRouter
};
