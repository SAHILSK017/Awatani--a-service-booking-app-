const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
  addService,
  getServices,
} = require("../controllers/serviceController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/category", getCategories);
router.post("/category", protect, isAdmin, addCategory);

router.get("/service", getServices);
router.post("/service", protect, isAdmin, addService);

module.exports = router;
