const mongoose = require('mongoose');
// package so the we can use email schema type for email validation, also install this package
require('mongoose-type-email');

// timestamps for creation and updatin date 
const userSchema = mongoose.Schema({
    name: { type: String, required: true, lowercase: true, unique: true },
    email: { type: mongoose.SchemaTypes.Email, required: true, lowercase: true },// for unique identification
    password: { type: String, min: 1, required: true },
    profilePic: {
        type: String,
        default:
            "https://img.freepik.com/free-vector/man-working-laptop-with-coffee-stationary-cartoon-vector-illustration_138676-2206.jpg",
    },
    mobileNumber: { type: String, required: true },
    uniqueUserId: { type: String, required: true, unique: true }, // for unique identification
    // bookings: [bookingSchema],
}, { versionKey: false, timestamps: true });




const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
