const Category = require("../models/Category");
const Service = require("../models/Service");

// ADD CATEGORYS
exports.addCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const normalizedName = name?.trim();

    if (!normalizedName) {
      return res.status(400).json({ message: "Category name required" });
    }

    const existingCategory = await Category.findOne({ name: normalizedName });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name: normalizedName, icon });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD SERVICE
exports.addService = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || price === undefined || price === null || !category) {
      return res
        .status(400)
        .json({ message: "Name, price and category are required" });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const service = await Service.create({
      name: name.trim(),
      description,
      price,
      category,
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SERVICES
exports.getServices = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const services = await Service.find(filter).populate("category");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
