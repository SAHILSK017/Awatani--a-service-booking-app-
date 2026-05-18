const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
  addService,
  getServices,
  deleteService,
} = require("../controllers/serviceController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { validateService } = require("../middleware/validationMiddleware");

router.get("/category", getCategories);
router.post("/category", protect, isAdmin, addCategory);

router.get("/service", getServices);
router.post("/service", protect, isAdmin, validateService, addService);
router.delete("/service/:id", protect, isAdmin, deleteService);

module.exports = router;
