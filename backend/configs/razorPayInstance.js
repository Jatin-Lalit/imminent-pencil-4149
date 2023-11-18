const Razorpay = require('razorpay');
require('dotenv').config(); // For CommonJS

var instance = new Razorpay({
    key_id: process.env.YOUR_KEY_ID,
    key_secret: process.env.YOUR_KEY_SECRET,
});

module.exports = { instance }