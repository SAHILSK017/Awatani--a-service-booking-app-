const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { rateLimiter } = require("./middleware/rateLimitMiddleware");

// Initialize Express
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://avatani.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Global rate limiting (150 requests per 15 minutes)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 150,
}));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api", require("./routes/serviceRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("Avatani Backend Running 🚀");
});

// Centralized error handler (must be after all routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
