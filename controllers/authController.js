const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { tokenStore } = require("../middleware/auth.js");
const Token = require("../models/Token");

// const tokenStore = {}; // This should match the store in auth.js
const TOKEN_INACTIVITY_LIMIT = 120 * 1000; // 120 seconds in milliseconds
const TOKEN_EXTENSION_TIME = 7 * 24 * 60 * 60 * 1000;

exports.signup = async (req, res) => {
	const { phoneNumber, password } = req.body;

	try {
		const user1 = await User.findOne({ phoneNumber });
		if (user1) {
			return res.status(404).json({
				success: false,
				message: "Phone Number already exists",
			});
		}
		const user = new User({ phoneNumber, password });
		await user.save();
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7D",
		});

		const tokenData = new Token({
			token: token,
			userId: user._id,
			lastActive: Date.now(),
			expiresAt: Date.now() + TOKEN_EXTENSION_TIME,
		});

		await tokenData.save();

		res.status(201).json({
			success: true,
			message: "New User Created Successfully",
			userId: user._id,
			token: token,
		});
	} catch (error) {
		console.error(
			"Error occurred while creating a new user",
			error.message
		);
		res.status(500).json({ success: false, error: error.message });
	}
};

exports.login = async (req, res) => {
	const { phoneNumber, password } = req.body;

	try {
		const user = await User.findOne({ phoneNumber });
		if (!user || !(await user.matchPassword(password))) {
			return res
				.status(404)
				.json({ success: false, message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7D",
		});
		// Store token in MongoDB with initial inactivity expiration of 120 seconds
		const tokenData = new Token({
			token: token,
			userId: user._id,
			lastActive: Date.now(),
			expiresAt: Date.now() + TOKEN_EXTENSION_TIME,
		});

		await tokenData.save();

		return res.status(200).json({
			success: true,
			message: "User Logged In Successfully",
			token: token,
		});
	} catch (error) {
		console.error(
			"Error occurred while logging in the user",
			error.message
		);

		res.status(500).json({ success: false, error: error.message });
	}
};

exports.userData = async (req, res) => {
	const userId = req.id.id;

	try {
		// Check if the userId is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid user ID" });
		}

		const user1 = await User.findById(userId);
		if (!user1) {
			return res.status(404).json({
				success: false,
				message: "The following Id doesn't exists",
			});
		}
		res.status(201).json({
			success: true,
			message: "User Data displayed Successfully",
			data: user1,
		});
	} catch (error) {
		console.error(
			"Error occurred while getting user details",
			error.message
		);
		res.status(500).json({ success: false, error: error.message });
	}
};
