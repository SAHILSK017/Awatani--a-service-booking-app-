const Category = require("../models/Category");
const Service = require("../models/Service");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Create a new category
exports.addCategory = asyncHandler(async (req, res) => {
  const { name, icon } = req.body;
  const normalizedName = name?.trim();

  if (!normalizedName) {
    throw new AppError("Category name required", 400);
  }

  const existingCategory = await Category.findOne({ name: normalizedName });
  if (existingCategory) {
    throw new AppError("Category already exists", 400);
  }

  const category = await Category.create({ name: normalizedName, icon });
  res.status(201).json(category);
});

// Get all categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Create a new service under a category
exports.addService = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || price === undefined || price === null || !category) {
    throw new AppError("Name, price and category are required", 400);
  }

  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const service = await Service.create({
    name: name.trim(),
    description,
    price,
    category,
  });

  res.status(201).json(service);
});

// Get all services, optionally filtered by category
exports.getServices = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const services = await Service.find(filter).populate("category");
  res.json(services);
});

// Delete a service by ID
exports.deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findByIdAndDelete(id);
  if (!service) {
    throw new AppError("Service not found", 404);
  }
  res.json({ message: "Service deleted successfully" });
});
