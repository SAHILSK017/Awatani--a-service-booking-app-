const Booking = require("../models/Booking");
const Service = require("../models/Service");

// ================= CREATE BOOKING =================
exports.createBooking = async (req, res) => {
  try {
    const { service, address, bookingDate } = req.body;

    if (!service || !address) {
      return res.status(400).json({ message: "All fields required" });
    }

    const selectedService = await Service.findById(service);
    if (!selectedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      service,
      address,
      bookingDate: bookingDate || undefined,
      status: "pending",
    });

    const populatedBooking = await booking.populate([
      { path: "service", populate: { path: "category" } },
      { path: "user", select: "name email role" },
    ]);

    res.status(201).json(populatedBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= USER BOOKINGS =================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({ path: "service", populate: { path: "category" } })
      .populate("worker", "name email role");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= WORKER BOOKINGS (MAIN FIX) =================
exports.getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { status: "pending" },
        { worker: req.user.id },
      ],
    })
      .populate({ path: "service", populate: { path: "category" } })
      .populate("user", "name email role")
      .populate("worker", "name email role");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ACCEPT =================
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Already taken" });
    }

    booking.status = "accepted";
    booking.worker = req.user.id;

    await booking.save();

    const populatedBooking = await booking.populate([
      { path: "service", populate: { path: "category" } },
      { path: "user", select: "name email role" },
      { path: "worker", select: "name email role" },
    ]);

    res.json({ message: "Booking accepted", booking: populatedBooking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= COMPLETE =================
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.worker || booking.worker.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your job" });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted bookings can be completed",
      });
    }

    booking.status = "completed";
    await booking.save();

    const populatedBooking = await booking.populate([
      { path: "service", populate: { path: "category" } },
      { path: "user", select: "name email role" },
      { path: "worker", select: "name email role" },
    ]);

    res.json({ message: "Booking completed", booking: populatedBooking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
