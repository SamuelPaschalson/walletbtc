const { ethers } = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const axios = require("axios");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const { Web3 } = require("web3");
const { formatBalance } = require("../utils/validation");
const wif = require("wif");

// BIP32Factory requires a Secp256k1 implementation
const bip32 = BIP32Factory(ecc);

const createWallet = async () => {
  try {
    console.log("Starting wallet creation...");
    const mnemonic = bip39.generateMnemonic();
    console.log("Mnemonic generated.");
    const seed = await bip39.mnemonicToSeed(mnemonic);
    console.log("Seed created from mnemonic.");
    const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
    console.log("Root key derived from seed.");
    const path = "m/44'/0'/0'/0/0";
    const account = root.derivePath(path);
    console.log("Account derived from path:", path);
    if (!account || !account.publicKey) {
      throw new Error("Failed to derive account or public key is missing");
    }
    const { address } = bitcoin.payments.p2pkh({ pubkey: account.publicKey });
    console.log("Bitcoin address generated:", address);
    if (!account.privateKey) {
      throw new Error("Private key is missing");
    }
    const privateKeyWIF = wif.encode(128, account.privateKey, true);
    console.log("Private key encoded to WIF format.");
    const wallet = {
      mnemonic,
      address,
      privateKey: privateKeyWIF,
      type: "BTC",
      balance: 0,
    };

    console.log("Wallet object created:", wallet);

    return { wallets: [wallet] };
  } catch (error) {
    console.error("Error in createWallet:", error);
    return { error: error.message };
  }
};

const connectWallet = async (mnemonic, privateKey, address) => {
  try {
    const wallets = [];
    let bitcoinAddress, wif;

    if (mnemonic) {
      // Derive address and private key from mnemonic
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      if (!seed) throw new Error("Failed to generate seed from mnemonic.");

      const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
      if (!root) throw new Error("Failed to generate root key from seed.");

      const path = "m/44'/0'/0'/0/0";
      const account = root.derivePath(path);
      if (!account || !account.privateKey) throw new Error("Failed to derive account or private key.");

      const keyPair = bitcoin.ECPair.fromPrivateKey(account.privateKey);
      bitcoinAddress = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;
      wif = keyPair.toWIF();
    } else if (privateKey) {
      // Use provided private key
      const keyPair = bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.bitcoin);
      bitcoinAddress = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;
      wif = privateKey;
    } else if (address) {
      // Use provided address (no signing capability)
      bitcoinAddress = address;
    } else {
      throw new Error("At least one of mnemonic, privateKey, or address must be provided.");
    }

    // Fetch balance
    const balanceUrl = `https://blockstream.info/api/address/${bitcoinAddress}`;
    const balanceResponse = await axios.get(balanceUrl);
    const balance =
      parseFloat(
        balanceResponse.data.chain_stats.funded_txo_sum / 1e8 -
        balanceResponse.data.chain_stats.spent_txo_sum / 1e8
      ) || 0;

    // Push wallet data
    wallets.push({
      address: bitcoinAddress,
      privateKey: wif || null,
      type: "BTC",
      balance,
    });

    return { wallets };
  } catch (error) {
    console.error("Error in connectWallet:", error.message);
    throw error;
  }
};

const connectWalletByAddress = async (address, addressType) => {
  const wallet = [];
  // Bitcoin Wallet
  if (addressType === "BTC") {
    try {
      bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
    } catch (error) {
      throw new Error("Invalid Bitcoin address");
    }
    const balanceUrl = `https://blockstream.info/api/address/${address}`;
    const transactionsUrl = `https://blockstream.info/api/address/${address}/txs`;
    const [balanceResponse, transactionsResponse] = await Promise.all([
      axios.get(balanceUrl),
      axios.get(transactionsUrl),
    ]);
    wallet.push({
      address: address,
      type: "BTC",
      balance:
        parseFloat(
          balanceResponse.data.chain_stats.funded_txo_sum / 1e8 -
            balanceResponse.data.chain_stats.spent_txo_sum / 1e8
        ) || 0, // Convert satoshis to BTC
      transactions: transactionsResponse.data,
    });
  }
  return { wallet };
};

const getBalance = async (wallet) => {
  const wallets = [];
  try {
    const { type, address } = wallet;
    let balance;
    switch (type) {
      // Bitcoin
      case "BTC":
        const balanceUrl = `https://blockstream.info/api/address/${address}`;
        const balanceResponse = await axios.get(balanceUrl);
        balance =
          (balanceResponse.data.chain_stats.funded_txo_sum -
            balanceResponse.data.chain_stats.spent_txo_sum) /
            1e8 || 0;

        wallets.push({
          balance: balance.toFixed(8),
          type: "BTC",
          address: address,
        });
        break;
      default:
        console.log(`Unsupported wallet type: ${type}`);
        break;
    }

    return { wallets };
  } catch (error) {
    console.error("Error getting wallet balance:", error.message);
    return { message: "Failed to get wallet balance" };
  }
};

const getHistory = async (wallet, page = 1) => {
  const wallets = [];
  const transactionsPerPage = 20;
  const startIndex = (page - 1) * transactionsPerPage;

  try {
    const { type, address } = wallet;
    let transactions = [];
    // Handle different wallet types dynamically
    switch (type) {
      // BTC
      case "BTC":
        const btcResponse = await axios.get(
          `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full`
        );
        transactions = btcResponse.data.txs.slice(
          startIndex,
          startIndex + transactionsPerPage
        );
        wallets.push({
          type: "BTC",
          address: address,
          transactions: transactions,
        });
        break;
      default:
        console.log(`Unsupported wallet type: ${type}`);
        break;
    }

    return wallets;
  } catch (error) {
    console.error("Error getting wallet history:", error.message);
    return { message: "Failed to get wallet history" };
  }
};

const transaction = async (wallet, type, toAddress, amount) => {
  const wallets = [];
console.log(wallet.privateKey);
  const decoded = wif.decode(wallet.privateKey); 
  console.log("WIF is valid:", decoded);
   try {
    if (type === "BTC") {
      const NETWORKS = bitcoin.networks.bitcoin;
      const network = NETWORKS;

      const getUtxos = async (address) => {
        const url =
          NETWORKS === bitcoin.networks.bitcoin
            ? `https://blockstream.info/api/address/${address}/utxo`
            : `https://blockstream.info/testnet/api/address/${address}/utxo`;
        const response = await axios.get(url);
        return response.data;
      };

      const keyPair = bitcoin.ECPair.fromWIF(wallet.privateKey, NETWORKS);
    
      const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network,
      });

      if (address !== wallet.address) {
        throw new Error(
          "The provided private key does not match the fromAddress."
        );
      }

      const utxos = await getUtxos(wallet.address);
      if (utxos.length === 0) {
        throw new Error("No UTXOs available for the provided address.");
      }

      const psbt = new bitcoin.Psbt({ network });
      const btcToSatoshis = (btc) => Math.round(btc * 1e8);
      let inputSum = 0;
      const valueInSatoshis = btcToSatoshis(amount);

      for (const utxo of utxos) {
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          nonWitnessUtxo: Buffer.from(utxo.hex, "hex"),
        });
        inputSum += utxo.value;
        if (inputSum >= valueInSatoshis) break;
      }

      if (inputSum < valueInSatoshis) {
        throw new Error("Insufficient funds.");
      }

      const fee = 10000; // Fixed fee (can be dynamic)
      const change = inputSum - valueInSatoshis - fee;

      psbt.addOutput({ address: toAddress, value: valueInSatoshis });
      if (change > 0) {
        psbt.addOutput({ address: wallet.address, value: change });
      }

      psbt.signAllInputs(keyPair);
      psbt.finalizeAllInputs();
      const tx = psbt.extractTransaction();
      const txHex = tx.toHex();

      const broadcastUrl =
        network === bitcoin.networks.bitcoin
          ? "https://blockstream.info/api/tx"
          : "https://blockstream.info/testnet/api/tx";
      const response = await axios.post(broadcastUrl, txHex);

      wallets.push({
        from: wallet.address,
        to: toAddress,
        amount: amount,
        txId: response.data,
        status: "Transaction performed",
      });
    }
    return { wallets };
  } catch (error) {
    if (
      error.message.includes("Invalid address") ||
      error.message.includes("Invalid toAddress")
    ) {
      return { error: error.message };
    }
    if (error.message.includes("insufficient funds")) {
      return { error: "Insufficient funds for the transaction." };
    }
    if (error.message.includes("nonce too low")) {
      return { error: "Nonce too low. Try again with a higher nonce." };
    }
    console.error("Error performing transaction:", error.message);
    return { error: "Failed to perform crypto transaction",message: error.message };
  }
};

const search = async (transactionId) => {
  const transaction = await Transaction.findByIdAndUpdate(
    transactionId,
    { category: newCategory },
    { new: true }
  );

  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  return transaction;
};

const getTransactions = async (wallet, page = 1, limit = 20) => {
  const transactionsPerPage = limit;
  const startIndex = (page - 1) * transactionsPerPage;

  try {
    const wallets = [];
    const walletType = wallet.type; // Adjust this based on your actual schema

    // Handle BTC transactions
    if (walletType === "BTC") {
      const response = await axios.get(
        `https://api.blockcypher.com/v1/btc/main/addrs/${wallet.address}/full`
      );

      if (response.data && response.data.txs) {
        const transactions = response.data.txs
          .slice(startIndex, startIndex + transactionsPerPage)
          .map((tx) => ({
            txId: tx.hash,
            date: tx.received,
            from: tx.inputs[0]?.addresses[0],
            to: tx.outputs[0]?.addresses[0],
            amount: tx.outputs[0]?.value / 1e8, // Convert from satoshis
          }));

        wallets.push({
          type: "BTC",
          address: wallet.address,
          transactions,
        });
      } else {
        throw new Error("No transactions found for this address");
      }
    }
    return wallets;
  } catch (error) {
    console.error("Error retrieving transaction history:", error.message);
    return { error: "Failed to retrieve wallet transaction history" };
  }
};

const getTransactionById = async (txId, type) => {
  const wallets = [];
  if (type == "BTC") {
    const url = `https://api.blockcypher.com/v1/btc/main/txs/${txId}?token=${
      process.env.BLOCKCYPHER_TOKEN || ""
    }`;

    const response = await axios.get(url);
    const respons = response.data;
    wallets.push({
      respons,
    });
  }
  return { wallets };
};

module.exports = {
  createWallet,
  connectWallet,
  connectWalletByAddress,
  getBalance,
  getHistory,
  getTransactions,
  transaction,
  search,
  getTransactionById,
};
