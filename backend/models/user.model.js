const mongoose = require("mongoose");
require("mongoose-type-email");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: mongoose.SchemaTypes.Email, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    nationality: { type: String },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    emergencyContacts: [
      {
        name: { type: String },
        relationship: { type: String },
        phoneNumber: { type: String },
      },
    ],

    paymentInfo: {
      paymentMethods: [
        {
          methodType: { type: String },
          cardNumberLastFour: { type: String },
          expirationDate: { type: String },
        },
      ],
      billingAddress: {
        fullName: { type: String },
        streetAddress: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
        phoneNumber: { type: String },
      },
    },

    medicalHistory: {
      allergies: [{ type: String }],
      medications: [{ type: String }],
      comments: { type: String },
    },

    languagePreferences: [{ type: String }],
    notificationSettings: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
    },
    preferences: {
      preferredBarber: { type: mongoose.Schema.Types.ObjectId, ref: "barber" },
      preferredService: { type: String },
    },

    loginHistory: [
      {
        timestamp: { type: Date },
        ipAddress: { type: String },
        deviceType: { type: String },
        browser: { type: String },
        location: {
          latitude: { type: Number },
          longitude: { type: Number },
        },
      },
    ],

    lastLogin: {
      timestamp: { type: Date },
      ipAddress: { type: String },
    },
    socialMedia: {
      facebook: {
        type: String,
        match: /^(https?:\/\/)?(www\.)?facebook.com\/.+$/,
      },
      twitter: {
        type: String,
        match: /^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9_]+$/,
      },
    },

    role: { type: String, enum: ["user", "admin"], default: "user" }, // not much useful here but still can be used differently

    isAccountEmailVerified: { type: Boolean, default: false }, // email verification
    isActive: { type: Boolean, default: true },
    passwordResetToken: { type: String },
    otpEmail: {
      code: { type: String },
      expiration: { type: Date },
      attempts: { type: Number, default: 0 },
      maxAttempts: { type: Number, default: 3 },
      lastAttempt: { type: Date },
      used: { type: Boolean, default: false },
    },

    otpMobile: {
      code: { type: String },
      expiration: { type: Date },
      attempts: { type: Number, default: 0 },
      maxAttempts: { type: Number, default: 3 },
      lastAttempt: { type: Date },
      used: { type: Boolean, default: false },
    },

    isTwoFactorAuthEnabled: { type: Boolean, default: false },

    privacySettings: {
      visibleEmail: { type: Boolean, default: true },
      visiblePhone: { type: Boolean, default: true },
    },

    preferredContactTime: {
      // ^ we can create custom slots here
      morning: { type: Boolean, default: false }, // e.g., 8 AM - 12 PM
      afternoon: { type: Boolean, default: false }, // e.g., 12 PM - 4 PM
      evening: { type: Boolean, default: false }, // e.g., 4 PM - 8 PM
      night: { type: Boolean, default: false }, // e.g., 8 PM - 12 AM
      lateNight: { type: Boolean, default: false }, // e.g., 12 AM - 6 AM
    },

    averageUserRating: { type: Number, default: 0 },

    // Subscription Plans
    subscription: {
      loyaltyPoints: { type: Number, default: 0 },
      details: {
        planType: {
          type: String,
          enum: ["basic", "premium", "superpremium"],
          default: "basic",
        },
        startDate: { type: Date },
        endDate: { type: Date },
        isActive: { type: Boolean, default: false },
      },
    },
    // Special Requests
    specialRequests: [{ type: String }],

    // Appointment History
    appointmentHistory: [
      {
        barberId: { type: mongoose.Schema.Types.ObjectId, ref: "barber" },
        appointmentDate: { type: Date },
        serviceBooked: { type: String },
        feedback: { type: String },
      },
    ],

    // Favorite Hairstyles
    favoriteHairstyles: [{ type: String }],
  },
  { versionKey: false, timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
