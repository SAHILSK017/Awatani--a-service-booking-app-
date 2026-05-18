const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { recordFailedAttempt, recordSuccessfulLogin } = require("../middleware/rateLimitMiddleware");

// Generate JWT with user id and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register a new user
const register = asyncHandler(async (req, res) => {
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

  res.status(201).json({
    token: generateToken(user._id, user.role),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Login with email and password
const login = asyncHandler(async (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    recordFailedAttempt(ip);
    throw new AppError("Email and password required", 400);
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    recordFailedAttempt(ip);
    throw new AppError("Invalid credentials", 400);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    recordFailedAttempt(ip);
    throw new AppError("Invalid credentials", 400);
  }

  // Reset failed counter on successful login
  recordSuccessfulLogin(ip);

  const token = generateToken(user._id, user.role);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = { register, login };
