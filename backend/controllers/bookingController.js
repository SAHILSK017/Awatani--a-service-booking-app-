const Booking = require("../models/Booking");
const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Create a new booking
exports.createBooking = asyncHandler(async (req, res) => {
  const { service, address, bookingDate, urgency, notes, paymentMethod, discountCode } = req.body;

  if (!service || !address) {
    throw new AppError("All fields required", 400);
  }

  const selectedService = await Service.findById(service);
  if (!selectedService) {
    throw new AppError("Service not found", 404);
  }

  const booking = await Booking.create({
    user: req.user.id,
    service,
    address,
    bookingDate: bookingDate || undefined,
    status: "pending",
    urgency: urgency || "standard",
    notes: notes || "",
    paymentMethod: paymentMethod || "cash",
    discountCode: discountCode || "",
  });

  const populatedBooking = await booking.populate([
    { path: "service", populate: { path: "category" } },
    { path: "user", select: "name email role" },
  ]);

  res.status(201).json(populatedBooking);
});

// Get bookings for the logged-in user
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({ path: "service", populate: { path: "category" } })
    .populate("worker", "name email role");

  res.json(bookings);
});

// Get bookings relevant to a worker (pending + assigned to them)
exports.getWorkerBookings = asyncHandler(async (req, res) => {
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
});

// Worker accepts a pending booking
exports.acceptBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status !== "pending") {
    throw new AppError("Already taken", 400);
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
});

// Worker marks a booking as completed
exports.completeBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (!booking.worker || booking.worker.toString() !== req.user.id) {
    throw new AppError("Not your job", 403);
  }

  if (booking.status !== "accepted") {
    throw new AppError("Only accepted bookings can be completed", 400);
  }

  booking.status = "completed";
  await booking.save();

  const populatedBooking = await booking.populate([
    { path: "service", populate: { path: "category" } },
    { path: "user", select: "name email role" },
    { path: "worker", select: "name email role" },
  ]);

  res.json({ message: "Booking completed", booking: populatedBooking });
});

// User cancels a pending booking
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.user.toString() !== req.user.id) {
    throw new AppError("Access denied. You can only cancel your own bookings.", 403);
  }

  if (booking.status !== "pending") {
    throw new AppError("Only pending bookings can be cancelled.", 400);
  }

  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking cancelled and deleted successfully" });
});

// Get a single booking by ID (owner, assigned worker, or admin)
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({ path: "service", populate: { path: "category" } })
    .populate("user", "name email role")
    .populate("worker", "name email role");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const userId = req.user.id;
  const userRole = req.user.role;
  const isOwner = booking.user && booking.user._id.toString() === userId;
  const isAssignedWorker = booking.worker && booking.worker._id.toString() === userId;
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isAssignedWorker && !isAdmin) {
    throw new AppError("Access denied. You do not have permission to view this booking.", 403);
  }

  res.json(booking);
});
