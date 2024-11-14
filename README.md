# Blockchain Service Api

This documentation will guide you through setting up and running the Blockchain Service API, interacting with API endpoints, and using authentication if implemented.

# Prerequisites

Nodejs 19 or higher

# Setup

## Clone the Repository

```bash
cd nodejs
```

## Installing the dependencies

### using npm

```js
npm install
```

### Using yarn

```js
yarn add
```

## Run the Application

### starting the development server

```js
npm run dev
```

### starting the project

```js
npm start
```

The application will start on http://localhost:8000 by default if the env is not set, but if set it will run on the set port.

## API Endpoints

### Auth Endpoints

Register using form data

```http
POST /api/auth/signup;
Content-Type: application/json
{
    "phoneNumber": "1234567890",
    "password": "1234567",
}
```

Response

```json
[
	{
		"success": true,
		"message": "New User Created Successfully",
		"token": "a randomly generated token"
	}
]
```

Login using form data or json data

```http
POST /api/auth/login;
Content-Type: application/json
{
    "phonenumber": "1234567890",
    "password": "1234567",
}
```

Response

```json
[
	{
		"success": true,
		"message": "User Logged In Successfully",
		"token": "generated token"
	}
]
```

### Wallet Endpoints

Before accessing the wallet endpoints set the following to headers
token Bearer (the generated token)

list of addressTypes
1: ETH
2: BTC
3: DOGE
4: BNB
5: LTC
6: SOL
7: TRX

Create new wallet using data

```http
POST /api/wallets/:userId/create-wallet;
Content-Type: application/json
{
    "userId": "the user id",
    "type": "blockchain",
}
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet Created Successfully",
		"wallet": {
			"type": "blockchain",
			"apiKey": "",
			"privateKey": "",
			"mnemonic": "generated mnemonics",
			"secretKey": "",
			"general_balance": 0,
			"wallets": [
				{
					"address": "0x5Fa3B6A4c8A09711e6d12D96f7A9a93e224b694e",
					"privateKey": "0xcc5dc6fc17a2fb2cd398cc71905ac8074b6b5d85684a23de04fde657a9d4ea7f",
					"hidden": false,
					"type": "ethereum",
					"balance": 0,
					"_id": "66a1851a03ace8bdb06d5a4a"
				},
				{
					"address": "1FTFRdpLY2NYW6VhqR2XmAEXZDjngsSUQ2",
					"privateKey": "L5hL7KDgxdaLUoVpxBvG7waTbDb8R6FTTmEGtHYTpEnqZeRbK2JC",
					"hidden": false,
					"type": "bitcoin",
					"balance": 0,
					"_id": "66a1851a03ace8bdb06d5a4b"
				},
				{
					"address": "DMh2PbQeh5en433W1KbikLfHRnDjjzdhWz",
					"privateKey": "QWoce3nwr6oj1F6wdspwmDN5nTnGLGfYAEBQHCBd2WHdMiMYaQ1T",
					"hidden": false,
					"type": "dogecoin",
					"balance": 0,
					"_id": "66a1851a03ace8bdb06d5a4c"
				},
				{
					"address": "0x5fa3b6a4c8a09711e6d12d96f7a9a93e224b694e",
					"privateKey": "cc5dc6fc17a2fb2cd398cc71905ac8074b6b5d85684a23de04fde657a9d4ea7f",
					"hidden": false,
					"type": "binance-smart-chain",
					"balance": 0,
					"_id": "66a1851a03ace8bdb06d5a4d"
				},
				{
					"address": "LQw35GnyCrE667XTnok9jKeW93aGdXL71f",
					"privateKey": "T9DvUKxp4yjPbkLrdXeeorDF1MjHR6sMYe4485paY5f5Bpj4D3a3",
					"hidden": false,
					"type": "litecoin",
					"balance": 0,
					"_id": "66a1851a03ace8bdb06d5a4e"
				},
				{
					"address": "7H343dn8ofzMZR1Wp14aVvPLcWBX4WRw3WKeUWLSDewH",
					"privateKey": "7bce5f83aff4b4fc7d93e5f015e89d75fba1453806adc2bd4ce225101d5834e55d41bc3b58e1bc35e724b971f9a670c549981185427d9e0c3e4e0fadd914bb90",
					"hidden": false,
					"type": "solana",
					"balance": 0,
					"_id": "66a1851a03ace8bdb06d5a4f"
				},
				{
					"address": "TFVir7HPhewNNThgvsWLLSFasYPDgbzAoy",
					"privateKey": "cd6f6b15c9534272f63d290c69bd5c9892db8243cbb691319fc8e19cbcfd1b38",
					"hidden": false,
					"type": "trx",
					"balance": 0,
					"_id": "66a1851a03ace8bdb06d5a50"
				}
			],
			"user": "66a06d8ce2dd8617401e1e8a",
			"_id": "66a1851a03ace8bdb06d5a49",
			"createdAt": "2024-07-24T22:50:02.655Z",
			"updatedAt": "2024-07-24T22:50:02.655Z",
			"__v": 0
		}
	}
]
```

Connect wallet

```http
POST /api/wallet/:userId/add-wallet;
Content-Type: application/json
{
    "userId": "1234567890",
    "type": "blockchain", (or binance)
    "privateKey": "private key",
    "publicKey": "public key",
    "mnemonic": "wallet mnemonic",
}
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet connected successfully",
		"wallets": {
			"wallet response data"
		},
	}
]
```

Connect wallet by address (note: the addressTypes are only 7)

```http
POST /api/wallet/:userId/connect-wallet-address;
Content-Type: application/json
{
    "address": "0x0*****",
    "type": "blockchain",
    "addressType": "ETH",
}
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet Connected Successfully",
		"data": {
			"address": "inserted address",
			"type": "ethereum",
			"balance": "address balance",
			"transactions": "transactionHistory"
		}
	}
]
```

Remove wallet by address (note: the addressTypes are only 7)

```http
DELTE /api/wallet/:userId/remove-wallet-address;
Content-Type: application/json
{
    "address": "0x0*****",
    "type": "blockchain",
    "addressType": "ethereum",
}
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet Removed Successfully",
		"data": "response of the hidden address"
	}
]
```

get wallet balance of the id

```http
GET /api/wallet/:walletId/get-balance;
Content-Type: application/json
{
    "type": "blockchain",
}
```

Response

```json
[
	{
		"success": true,
		"message": "General Balance listed successfully",
		"general_balance": "wallets balance"
	}
]
```

get wallet history of the id

```http
GET /api/wallet/:walletId/get-history?type=blockchain&page=10;
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet Transactions listed successfully in 10's",
		"history": "history of the wallet"
	}
]
```

get wallet nfts of the id

```http
GET /api/wallet/:walletId/get-balance?type=blockchain&address=wallet address;
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet NFT's listed successfully",
		"nft": "wallets nft"
	}
]
```

get wallet tokens of the id

```http
GET /api/wallet/:walletId/get-tokens?type=blockchain&tokenName=token name;
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet Tokens listed successfully",
		"token": "wallets token"
	}
]
```

add wallet tokens to the id

```http
POST /api/wallet/:walletId/add-tokens;
{
	"address": "0x40b0886efe202551F4Ba9746F9ca1852B2b67787",
	"tokenAddress": "0xabcdefabcdefabcdefabcdefabcdefabcdef",
    "tokenSymbol": "DAI",
    "tokenName": "Dai Stablecoin",
    "type": "ethereum",
    "blockchain": "blockchain",
    "tokenType": "ERC20",
}
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Token added successfully",
		"token": "wallets token data"
	}
]
```

perform a wallet transaction

```http
POST /api/wallet/:walletId/transaction;
{
	"type": "ETH",
	"blockchain": "blockchain",
	"toAddress": toAddress,
	"amount": 20
}
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Transaction carried out successfully"
	}
]
```

get wallet transaction

```http
GET /api/wallet/:walletId/get-transactions?type=blockchain&page=(usually in 10's) ;
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Transactions Listed successfully usually in 10's",
		"data": "transaction details"
	}
]
```

get wallet transaction by transaction id

```http
GET /api/wallet/:walletId/get-transactions?blockchain=blockchain&txId=(the txid of any transaction)&type=(type of coin it is);
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Transactions Listed successfully for the following id: ${txId}",
		"data": "transaction details"
	}
]
```

search for wallet transaction by the amount, category, type of coin

```http
GET /api/wallet/:walletId/search?blockchain=blockchain&amount=(the amount you wanna use)&type=(type of coin it is)&category=(name ofthe category);
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Transactions Listed successfully for the following id: ${txId}",
		"data": "transaction details"
	}
]
```

get wallet by category

```http
GET /api/wallet/:walletId/categories
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet Transactions listed successfully",
		"categories": "categories list"
	}
]
```

get categorised transactions

```http
GET /api/wallet/:walletId/categorised-transactions?type=blockchain&category=(categories are usually Uncategorised by default, then you get Income and expense when you categorise the transactions, then you can edit the categorie in the nest endpoint);
Content-Type: application/json
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet Transactions listed successfully",
		"categories": "transaction details"
	}
]
```

recategorze transactions

```http
POST /api/wallet/:walletId/recategorise-transactions ;
Content-Type: application/json
{
	"txId": "transaction id"
	"newCategory": "new category name"
}
```

Response

```json
[
	{
		"success": true,
		"message": "Wallet Transactions ReCategorised successfully",
		"transactions": "re categorised data"
	}
]
```
