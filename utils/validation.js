const { body, validationResult } = require("express-validator");

const signupValidation = [
	body("phoneNumber").notEmpty().withMessage("Phone number is required"),
	body("password").notEmpty().withMessage("Password is required"),
];

const loginValidation = [
	body("phoneNumber").notEmpty().withMessage("Phone number is required"),
	body("password").notEmpty().withMessage("Password is required"),
];

const formatBalance = (balance) => {
	if (balance.toString().includes("e")) {
		return parseFloat(balance)
			.toFixed(10)
			.replace(/\.?0+$/, "");
	}
	return parseFloat(balance).toLocaleString("en-US", {
		maximumFractionDigits: 10,
	});
};
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

module.exports = { signupValidation, loginValidation, validate, formatBalance };
