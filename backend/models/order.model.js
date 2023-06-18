const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true },
    customerId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    items: [
    ],
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model('order', orderSchema);

module.exports = { OrderModel };
