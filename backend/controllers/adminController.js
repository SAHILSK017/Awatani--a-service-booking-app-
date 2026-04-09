const User = require("../models/User");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate({
        path: "service",
        select: "name price category",
        populate: { path: "category", select: "name icon" },
      })
      .populate("worker", "name email role");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL SERVICES
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("category", "name icon");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getAllBookings,
  getAllServices,
};
