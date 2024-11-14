const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    toAddress: {
      type: String,
      required: true,
    },
    fromAddress: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    txId: {
      type: String,
      required: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
