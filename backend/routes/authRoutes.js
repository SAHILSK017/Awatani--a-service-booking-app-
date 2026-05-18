const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { checkLoginRateLimit } = require("../middleware/rateLimitMiddleware");

router.post("/register", register);
router.post("/login", checkLoginRateLimit, login);

module.exports = router;
