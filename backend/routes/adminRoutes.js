const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");

const {
  getAllUsers,
  getAllBookings,
  getAllServices,
} = require("../controllers/adminController");

// ADMIN ROUTES
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/bookings", protect, isAdmin, getAllBookings);
router.get("/services", protect, isAdmin, getAllServices);

module.exports = router;
