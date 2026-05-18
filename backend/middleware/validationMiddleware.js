// Input validation for admin user CRUD and service creation.

const validateUser = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const isUpdate = req.method === "PUT";

  // Name, email, password required for creation
  if (!isUpdate && (!name || !email || !password)) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  // Name must be at least 2 characters
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters long" });
    }
  }

  // Basic email format check
  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Invalid email format" });
    }
  }

  // Password must be at least 6 characters (skip if blank on update)
  if (password !== undefined) {
    if (isUpdate && password === "") {
      // Allow blank password on update to keep existing
    } else if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
  }

  // Role must be one of the allowed values
  if (role !== undefined) {
    if (!["user", "worker", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }
  }

  next();
};

const validateService = (req, res, next) => {
  const { name, price, category } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({ message: "Name, price, and category are required" });
  }

  if (typeof name !== "string" || name.trim().length < 3) {
    return res.status(400).json({ message: "Service name must be at least 3 characters long" });
  }

  const parsedPrice = Number(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  // Validate MongoDB ObjectId format
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(category)) {
    return res.status(400).json({ message: "Invalid category ID format" });
  }

  next();
};

module.exports = {
  validateUser,
  validateService,
};
