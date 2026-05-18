const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const { validateUser } = require("../middleware/validationMiddleware");

const {
  getAllUsers,
  getAllBookings,
  getAllServices,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

// ADMIN ROUTES
router.get("/users", protect, isAdmin, getAllUsers);
router.post("/users", protect, isAdmin, validateUser, createUser);
router.put("/users/:id", protect, isAdmin, validateUser, updateUser);
router.delete("/users/:id", protect, isAdmin, deleteUser);

router.get("/bookings", protect, isAdmin, getAllBookings);
router.get("/services", protect, isAdmin, getAllServices);

module.exports = router;
