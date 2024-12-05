
const { ethers } = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const axios = require("axios");
const { BIP32Factory } = require("bip32");
const ecc = require("tiny-secp256k1");
const { Web3 } = require("web3");
const { formatBalance } = require("../utils/validation");
const wif = require("wif");
const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const bs58check = require('bs58check');


// BIP32Factory requires a Secp256k1 implementation
const bip32 = BIP32Factory(ecc);

const createWallet = async () => {
  try {
   const mnemonic = bip39.generateMnemonic();
    const wallets = [];
    // Bitcoin Wallet
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
    // Use the BIP44 derivation path for Bitcoin: m/44'/0'/0'/0/0
    // Use the BIP84 derivation path for Bitcoin: m/84'/0'/0'/0/0
    const path = "m/44'/0'/0'/0/0";
    const account = root.derivePath(path);
    const privateKeyUint8 = new Uint8Array(account.privateKey);

    if (privateKeyUint8.length !== 32) {
      throw new Error("Invalid private key length");
    }
    const bitcoinW = bitcoin.payments.p2pkh({ pubkey: account.publicKey });
    wallets.push({
      mnemonic: mnemonic,
      address: bitcoinW.address,
      privateKey: account.toWIF(),
      type: "BTC",
      balance: 0,
    });

  return { wallets };
  } catch (error) {
    console.error("Error in createWallet:", error);
    return { error: error.message };
  }
};

const connectWallet = async (mnemonic, privateKey, address) => {
  try {
     // Bitcoin Wallet
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
  // Use the BIP44 derivation path for Bitcoin: m/44'/0'/0'/0/0
  // Use the BIP84 derivation path for Bitcoin: m/84'/0'/0'/0/0
  const path = "m/44'/0'/0'/0/0";
  const account = root.derivePath(path);
    const privateKeyUint8 = new Uint8Array(account.privateKey);

    if (privateKeyUint8.length !== 32) {
      throw new Error("Invalid private key length");
    }
  const bitcoinW = bitcoin.payments.p2pkh({ pubkey: account.publicKey });
  const balanceUrlb = `https://blockstream.info/api/address/${bitcoinW.address}`;
  const [balanceResponseb] = await Promise.all([axios.get(balanceUrlb)]);
  wallets.push({
    address: bitcoinW.address,
    privateKey: account.toWIF(),
    type: "BTC",
    balance:
      parseFloat(
        balanceResponseb.data.chain_stats.funded_txo_sum / 1e8 -
          balanceResponseb.data.chain_stats.spent_txo_sum / 1e8
      ) || 0,
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

const transaction = async (wallet, type, toAddress, amount, network = 'mainnet') => {
  try {
    const wallets = [];
    const deriveBitcoinAddress = (privateKeyHex, networkPrefix = 0x00) => {
      const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');

      if (!secp256k1.privateKeyVerify(privateKeyBuffer)) {
        throw new Error('Invalid private key');
      }

      const publicKeyBuffer = secp256k1.publicKeyCreate(privateKeyBuffer, true);
      const sha256Hash = crypto.createHash('sha256').update(publicKeyBuffer).digest();
      const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
      const prefixedHash = Buffer.concat([Buffer.from([networkPrefix]), ripemd160Hash]);
      return bs58check.encode(prefixedHash);
    };

    // Ensure we are using the correct private key in Uint8Array format
    const privateKeyUint8 = new Uint8Array(wallet.privateKey);  // The private key from the wallet

    // Get address derived from the private key
    const fromAddress = wallet.address;

    console.log('From Address:', fromAddress);

    // Fetch UTXOs (Unspent Transaction Outputs) for the wallet
    const apiBaseUrl = network === 'mainnet'
      ? 'https://blockstream.info/api'
      : 'https://blockstream.info/testnet/api';
    const utxosUrl = `${apiBaseUrl}/address/${fromAddress}/utxo`;
    const utxosResponse = await axios.get(utxosUrl);
    const utxos = utxosResponse.data;

    if (utxos.length === 0) {
      throw new Error('No UTXOs available for the address.');
    }

    // Calculate input sum and prepare inputs
    let inputSum = 0;
    const inputs = [];
    const btcToSatoshis = (btc) => Math.round(btc * 1e8);
    const valueInSatoshis = btcToSatoshis(amount);

    for (const utxo of utxos) {
      inputSum += utxo.value;
      inputs.push({
        hash: Buffer.from(utxo.txid, 'hex').reverse(),
        index: utxo.vout,
        nonWitnessUtxo: Buffer.from(utxo.hex, 'hex'),
      });
      if (inputSum >= valueInSatoshis) break;
    }

    if (inputSum < valueInSatoshis) {
      throw new Error('Insufficient funds for the transaction.');
    }

    // Construct outputs
    const fee = 10000; // Fixed fee (can be dynamic)
    const change = inputSum - valueInSatoshis - fee;
    const outputs = [{ address: toAddress, value: valueInSatoshis }];
    if (change > 0) {
      outputs.push({ address: fromAddress, value: change });
    }

    // Build the PSBT (Partially Signed Bitcoin Transaction)
    const psbt = new bitcoin.Psbt({ network: bitcoin.networks[network === 'mainnet' ? 'bitcoin' : 'testnet'] });
    inputs.forEach((input) => psbt.addInput(input));
    outputs.forEach((output) => psbt.addOutput(output));

    // Sign each input with the private key (no verification step)
    inputs.forEach((_, index) => {
      const keyPair = bitcoin.ECPair.fromPrivateKey(privateKeyUint8);
      psbt.signInput(index, keyPair);
    });

    // Finalize and extract the transaction hex
    psbt.finalizeAllInputs();
    const txHex = psbt.extractTransaction().toHex();

    // Broadcast the transaction to the network
    const broadcastUrl = `${apiBaseUrl}/tx`;
    const broadcastResponse = await axios.post(broadcastUrl, txHex);

    wallets.push({
      from: fromAddress,
      to: toAddress,
      amount: amount,
      txId: broadcastResponse.data,
      status: "Transaction performed",
    });

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
    return { error: "Failed to perform crypto transaction", message: error.message };
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
