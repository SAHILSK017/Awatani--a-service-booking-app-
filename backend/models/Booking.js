const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // worker initially null
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },

    address: {
      type: String,
      required: true,
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },

    // Premium Additions
    urgency: {
      type: String,
      enum: ["standard", "priority", "express"],
      default: "standard",
    },

    notes: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card"],
      default: "cash",
    },

    discountCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);