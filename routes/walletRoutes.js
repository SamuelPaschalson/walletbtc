const express = require("express");
const {
  createWallet,
  connectWalletAddress,
  getWalletBalance,
  getWalletHistory,
  transactions,
  getTransactionById,
  getTransactions,
  search,
  walletById,
} = require("../controllers/walletController");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/:userId/create-wallet", auth, createWallet);
router.post("/:userId/connect-wallet-address", auth, connectWalletAddress);
// router.delete("/:userId/remove-wallet-address", auth, removeWalletAddress);
router.get("/:walletId/get-balance", auth, getWalletBalance);
router.get("/:walletId/get-history", auth, getWalletHistory);
router.post("/:walletId/transactions", auth, transactions);
router.get("/:walletId/get-transactions", auth, getTransactions);
router.get("/:walletId/get-transactions", auth, getTransactionById);
router.get("/:walletId/search", auth, search);
router.get("/:walletId", auth, walletById);

module.exports = router;
