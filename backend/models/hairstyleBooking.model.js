const mongoose = require('mongoose');

const hairStyleBookingSchema = new mongoose.Schema({
  uniqueBarberId: { type: String, required: true, unique: true },
  uniqueUserId: { type: String, required: true, unique: true },
  hairstyleUniqueId: { type: String, required: true, unique: true },
  bookingUniqueId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  barberName: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  hairstyleName: { type: String, required: true },
  status: { type: String, required: true }
});

const HairStyleBookingModel = mongoose.model('hairstyleBooking', hairStyleBookingSchema);

module.exports = { HairStyleBookingModel };
