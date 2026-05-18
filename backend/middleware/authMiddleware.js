const jwt = require("jsonwebtoken");

// Verify JWT token and attach user to request
exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Restrict to workers only
exports.isWorker = (req, res, next) => {
  if (req.user.role !== "worker") {
    return res.status(403).json({
      message: "Access denied. Worker only",
    });
  }
  next();
};

// Restrict to admins only
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
