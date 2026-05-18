const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getWorkerBookings,
  acceptBooking,
  completeBooking,
  deleteBooking,
  getBookingById,
} = require("../controllers/bookingController");

const { protect, isWorker } = require("../middleware/authMiddleware");

// USER
router.post("/", protect, createBooking);
// USER & WORKER STATIC ROUTES
router.get("/my", protect, getMyBookings);
router.get("/worker", protect, isWorker, getWorkerBookings);

// DYNAMIC ROUTES (Must be at the bottom)
router.get("/:id", protect, getBookingById);
router.delete("/:id", protect, deleteBooking);
router.put("/:id/accept", protect, isWorker, acceptBooking);
router.put("/:id/complete", protect, isWorker, completeBooking);

module.exports = router;