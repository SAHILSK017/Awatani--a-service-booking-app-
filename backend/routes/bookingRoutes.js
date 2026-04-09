const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getWorkerBookings,
  acceptBooking,
  completeBooking,
} = require("../controllers/bookingController");

const { protect, isWorker } = require("../middleware/authMiddleware");

// USER
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

// WORKER
router.get("/worker", protect, isWorker, getWorkerBookings);
router.put("/:id/accept", protect, isWorker, acceptBooking);
router.put("/:id/complete", protect, isWorker, completeBooking);

module.exports = router;