const Wallet = require("../models/Wallet");
const User = require("../models/User");
const blockchainService = require("../wallets/blockchain");
const Transaction = require("../models/Transaction");
const validAddressTypes = require("../utils/constants");
const bip39 = require("bip39");

exports.createWallet = async (req, res) => {
  const { userId, type } = req.body;
  try {
    let walletData;
    switch (type) {
      case "blockchain":
        walletData = await blockchainService.createWallet();
        break;
      default:
        throw new Error("Unsupported wallet type");
    }
    console.log(walletData);

    const newWallet = new Wallet({
      user: userId,
      mnemonic: walletData.wallets[0].mnemonic,
      address: walletData.wallets[0].address,
      privateKey: walletData.wallets[0].privateKey,
      type,
      balance: walletData.wallets[0].balance,
    });
    // console.log(newWallet);

    const wallets = await newWallet.save();
    if (wallets) {
      const user = await User.findById(userId);
      user.wallets.push(newWallet._id);
      await user.save();
    } else {
      throw new Error("Error creating wallet");
    }

    return res.status(201).json({
      success: true,
      message: "Wallet Created Successfully",
      walletData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.connectWalletAddress = async (req, res) => {
  const { address, privateKey } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    // Step 1: Find all BTC wallets for the user by userId
    let wallets = await Wallet.find({ user: userId, type: "BTC" });

    // If no BTC wallets exist, create a new wallet
    if (wallets.length === 0) {
      const mnemonic = bip39.generateMnemonic();
      const newWallet = new Wallet({
        type: "BTC",
        address: address,
        privateKey: privateKey || "",
        mnemonic: mnemonic,
        user: userId,
        balance: 0,
        transactions: [],
      });

      await newWallet.save();

      // Update user model to include the new wallet
      user.wallets.push(newWallet._id);
      await user.save();

      return res.status(201).json({
        success: true,
        message: "New BTC wallet created and address added.",
        wallet: newWallet,
      });
    }

    // Step 2: Check if the address already exists in any BTC wallet
    const existingWallet = wallets.find((wallet) => wallet.address === address);

    if (existingWallet) {
      return res.status(400).json({
        success: false,
        error: "The address already exists.",
      });
    }

    // Step 3: Add the address to an existing wallet or create a new BTC wallet if limit per wallet is reached
    if (wallets.length < 5) {
      // Define a max limit per user
      const mnemonic = bip39.generateMnemonic();
      const newWallet = new Wallet({
        type: "BTC",
        address: address,
        privateKey: privateKey || "",
        mnemonic: mnemonic,
        user: userId,
        balance: 0,
        transactions: [],
      });

      await newWallet.save();

      user.wallets.push(newWallet._id);
      await user.save();

      return res.status(201).json({
        success: true,
        message: "New BTC wallet created with the provided address.",
        wallet: newWallet,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Maximum number of BTC wallets reached.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// exports.removeWalletAddress = async (req, res) => {
//   const { address, type, addressType } = req.body;
//   const { userId } = req.params;
//   try {
//     let walletData;
//     switch (type) {
//       case "blockchain":
//         walletData = await blockchainService.removeWalletByAddress(
//           address,
//           addressType
//         );

//         break;
//       default:
//         throw new Error("Unsupported wallet type");
//     }
//     const walletD = await Wallet.findOneAndUpdate(
//       { type, "wallets.type": addressType },
//       { $set: { "wallets.$.hidden": true } },
//       { new: true }
//     );

//     // Filter out hidden wallets before sending the response
//     if (walletD) {
//       walletD.wallets = walletD.wallets.filter((wallet) => !wallet.hidden);
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Wallet Removed Successfully",
//       walletD,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

exports.getWalletBalance = async (req, res) => {
  const { walletId } = req.params;
  const { type } = req.body;

  try {
    const wallet = await Wallet.findById(walletId);
    let wallets;
    switch (type) {
      case "blockchain":
        wallets = await blockchainService.getBalance(wallet);
        break;
      default:
        throw new Error("Unsupported wallet type");
    }
    wallet.balance = wallets.wallets[0].balance;
    await wallet.save();
    console.log();

    return res.status(200).json({
      success: true,
      message: "General Balance listed successfully",
      balance: wallets.wallets[0].balance,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWalletHistory = async (req, res) => {
  const { walletId } = req.params;
  const { type, page } = req.query;
  const limit = parseInt(req.query.page, 10) || 10; // Default limit to 10 transactions

  try {
    const wallet = await Wallet.findById(walletId);
    let history;
    switch (type) {
      case "blockchain":
        history = await blockchainService.getHistory(wallet, page);
        break;
      default:
        throw new Error("Unsupported wallet type");
    }
    wallet.transactions = history[0].transactions;
    wallet.save();
    return res.status(200).json({
      success: true,
      message: "Wallet Transactions listed successfully in 10's",
      history: history[0].transactions,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.transactions = async (req, res) => {
  const { walletId } = req.params;
  const { type, blockchain, toAddress, amount } = req.body;
  if (!type || !blockchain || !toAddress || !amount) {
    return res.status(404).json({
      error:
        "All parameters (type, blockchain, toAddress, amount) are required.",
    });
  }
  try {
    const wallet = await Wallet.findById(walletId);
    let tokens;
    switch (blockchain) {
      case "blockchain":
        tokens = await blockchainService.transaction(
          wallet,
          type,
          toAddress,
          amount
        );
        break;
      default:
        throw new Error("Unsupported wallet type");
    }
    // console.log(tokens);
    if (!tokens.error) {
      const transact = new Transaction({
        txId: tokens.wallets[0].txId,
        wallet: walletId,
        toAddress: tokens.wallets[0].to,
        fromAddress: tokens.wallets[0].from,
        amount: tokens.wallets[0].amount,
      });
      const transacted = await transact.save();
      if (transacted) {
        const transactss = await Wallet.findById(walletId);
        transactss.wallets[0].transactions.push(transact._id);
        await transactss.save();
      } else {
        throw new Error("Error creating wallet");
      }
      return res.status(200).json({
        success: true,
        message: "Transaction carried out successfully",
        transaction: transacted,
      });
    }
    return res.status(404).json({
      success: false,
      message: tokens.error,
    });
  } catch (error) {
    res.status(500).json({ sucess: false, error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  const { walletId } = req.params;
  const { type, page = 1 } = req.query;
  const limit = parseInt(req.query.limit, 10) || 20;

  try {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    let tokens;
    switch (type) {
      case "blockchain":
        tokens = await blockchainService.getTransactions(wallet, page, limit);
        break;
      default:
        throw new Error("Unsupported wallet type");
    }

    return res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      transactions: tokens,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.search = async (req, res) => {
  const { walletId } = req.params;
  const { amount, type, category, blockchain } = req.query;

  try {
    const wallet = await Wallet.findById(walletId);
    let tokens;
    switch (blockchain) {
      case "blockchain":
        let query = {};

        if (amount) {
          query.amount = Number(amount);
        }

        if (type) {
          if (type.toLowerCase() === "income") {
            query.category = "Income";
          } else if (type.toLowerCase() === "expense") {
            query.category = "Expense";
          } else {
            return res.status(404).json({
              error: 'Invalid type. Use "income" or "expense"',
            });
          }
        }

        if (category) {
          query.category = category;
        }

        tokens = await Transaction.find(query);
        break;
      default:
        throw new Error("Unsupported wallet type");
    }
    res.status(200).json({
      success: true,
      message: "Search results displayed below",
      search: tokens,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  const { walletId } = req.params;
  const { txId, type, blockchain } = req.query;
  try {
    const wallet = await Transaction.findById(txId);
    if (wallet.txId == txId) {
      let tokens;
      switch (blockchain) {
        case "blockchain":
          tokens = await blockchainService.getTransactionById(txId, type);
          break;
        default:
          throw new Error("Unsupported wallet type");
      }
      res.json({
        sucess: true,
        message: `Transactions Listed successfully for the following id: ${txId}`,
        data: tokens,
      });
    } else {
      res.status(404).json({ success: false, error: "Invalid txId" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.walletById = async (req, res) => {
  const { walletId } = req.params;
  try {
    // Find the wallet by ID
    const wallet = await Wallet.findById(walletId);

    // Check if the wallet exists
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    // Respond with the wallet details
    res.status(200).json({
      success: true,
      message: "Wallet details fetched successfully",
      wallet,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
