const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const TOKEN_INACTIVITY_LIMIT = 120 * 1000; // 120 seconds in milliseconds
const TOKEN_EXTENSION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

module.exports = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Access denied. No token provided.",
			});
		}

		try {
			// Verify the token
			const user = jwt.verify(token, process.env.JWT_SECRET);

			// Find token data in MongoDB
			const tokenData = await Token.findOne({ token: token });

			if (!tokenData) {
				return res.status(401).json({
					success: false,
					message: "Token not found or already expired.",
				});
			}

			const currentTime = Date.now();
			const timeSinceCreation = currentTime - tokenData.createdAt;
			const timeSinceLastActive = currentTime - tokenData.lastActive;

			// Invalidate token if it hasn't been used within 120 seconds of creation
			if (
				timeSinceCreation > TOKEN_INACTIVITY_LIMIT &&
				timeSinceLastActive > TOKEN_INACTIVITY_LIMIT
			) {
				await Token.deleteOne({ token: token });
				return res.status(401).json({
					success: false,
					message: "Token expired due to inactivity.",
				});
			}

			// If the token is used within the inactivity period, extend its expiration
			if (timeSinceLastActive <= TOKEN_INACTIVITY_LIMIT) {
				tokenData.lastActive = currentTime;
				tokenData.expiresAt = currentTime + TOKEN_EXTENSION_TIME; // Extend for another 7 days
				await tokenData.save();
			}

			// Attach user to request object
			req.id = user;
			next();
		} catch (err) {
			// Handle token verification error
			return res.status(401).json({
				success: false,
				message: "Token is not valid",
			});
		}
	} else {
		// Token not provided
		return res.status(401).json({
			success: false,
			message: "Access denied. No token provided.",
		});
	}
};
