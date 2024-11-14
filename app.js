// Necessary packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config");
connectDB();

// routes
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");

// port, express and cors setup
const app = express();
app.use(express.json({ extended: true }));
app.use(cors());

// setup port and listening for the port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// endpoints
app.get("/api/", (_, __) =>
  __.status(200).json({ message: "This is a blockchain API service" })
);
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use((_, __) => {
  __.status(400).json({ message: "Prohibited" });
});

module.exports = app;
