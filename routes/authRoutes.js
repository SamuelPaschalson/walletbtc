const express = require("express");
const { signup, login, userData } = require("../controllers/authController");
const {
	signupValidation,
	loginValidation,
	validate,
} = require("../utils/validation");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/signup", signupValidation, validate, signup);
router.post("/login", loginValidation, validate, login);
router.get("/user", auth, userData);

module.exports = router;
