const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
    },
    mnemonic: {
      type: String,
      default: "",
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", WalletSchema);
