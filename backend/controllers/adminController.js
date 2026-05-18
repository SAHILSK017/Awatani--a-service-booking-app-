const User = require("../models/User");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Get all users (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Get all bookings with populated refs (admin)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email role")
    .populate({
      path: "service",
      select: "name price category",
      populate: { path: "category", select: "name icon" },
    })
    .populate("worker", "name email role");
  res.json(bookings);
});

// Get all services (admin)
const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().populate("category", "name icon");
  res.json(services);
});

// Create a new user (admin)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name || !normalizedEmail || !password) {
    throw new AppError("All fields required", 400);
  }

  if (role && !["user", "worker", "admin"].includes(role)) {
    throw new AppError("Invalid role selected", 400);
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: role || "user",
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json(userResponse);
});

// Update an existing user (admin)
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (email) {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== user.email) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        throw new AppError("Email already exists", 400);
      }
      user.email = normalizedEmail;
    }
  }

  if (name) user.name = name.trim();

  if (role) {
    if (!["user", "worker", "admin"].includes(role)) {
      throw new AppError("Invalid role selected", 400);
    }
    user.role = role;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.json(userResponse);
});

// Delete a user (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({ message: "User deleted successfully" });
});

module.exports = {
  getAllUsers,
  getAllBookings,
  getAllServices,
  createUser,
  updateUser,
  deleteUser,
};
