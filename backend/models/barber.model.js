const mongoose = require('mongoose');
const Email = require('mongoose-type-email'); // Importing the mongoose-type-email package

    const barberSchema = new mongoose.Schema({
        name: { type: String, required: true, lowercase: true, unique: true },
        email: { type: Email, required: true, lowercase: true }, // Use the Email type from mongoose-type-email
        password: { type: String, min: 1, required: true },
        phoneNumber: { type: String, required: true },
        specialization: { type: String, required: true },
        availability: { type: Boolean, default: true }, // Fix the default value syntax
        experience: { type: Number, default: 0 },
        uniqueBarberId: { type: String, required: true, unique: true }, profilePic: {
            type: String,
            default:
                "https://img.freepik.com/free-vector/man-working-laptop-with-coffee-stationary-cartoon-vector-illustration_138676-2206.jpg",
        },
    });

const BarberModel = mongoose.model('Barber', barberSchema); // Use 'Barber' as the model name

module.exports = { BarberModel };
