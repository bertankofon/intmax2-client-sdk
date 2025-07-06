# INTMAX2 Client SDK - Vite React Example

This example demonstrates how to use the `intmax2-client-sdk` with React and Vite to create a modern, beautiful wallet interface.

## ✨ Features

- 🔐 **Secure Authentication** - Login/logout with IntMax2 accounts
- 💰 **Balance Management** - View token balances in real-time
- 📤 **Deposits** - Deposit tokens to your IntMax2 wallet
- 🚀 **Single Transfers** - Send tokens to other addresses
- 🎯 **Batch Transfers** - Send multiple transfers in a single transaction (NEW!)
- 💸 **Withdrawals** - Withdraw tokens to Ethereum addresses
- 📊 **Transaction History** - View past transactions and transfers
- 🎨 **Modern UI** - Beautiful glass-morphism design with gradients
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🚀 New Batch Transfer Feature

The batch transfer feature allows you to send multiple transfers to different addresses in a single transaction, which is more efficient and cost-effective than sending individual transfers.

### Benefits:
- **Cost Efficient**: Pay transaction fees once for multiple transfers
- **Time Saving**: Execute multiple transfers simultaneously
- **Better UX**: Manage multiple recipients in one interface
- **Atomic Execution**: All transfers succeed or fail together

### How to Use:
1. Navigate to the "Batch Transfer" section
2. Add multiple transfer recipients using the "+ Add Transfer" button
3. Select tokens and amounts for each recipient
4. Review the batch summary
5. Execute all transfers in one transaction

## 🎨 Design Features

- **Glass-morphism UI** with backdrop blur effects
- **Gradient backgrounds** and modern color schemes
- **Smooth animations** and hover effects
- **Responsive grid layout** that adapts to different screen sizes
- **Interactive components** with real-time feedback
- **Professional typography** and spacing

## 🛠️ Setup

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- pnpm package manager

### 1. Build the browser-sdk

First, you need to build the browser-sdk:

```bash
# From the root of the repository
cd browser-sdk
pnpm install
pnpm build
```

### 2. Install Dependencies

```bash
cd examples/vite
pnpm install
```

### 3. Add Missing Dependencies

The Vite example requires some additional dependencies:

```bash
pnpm add axios @scure/bip32 @scure/bip39
```

### 4. Environment Configuration (Optional)

Create a `.env` file in the `examples/vite` directory:

```env
VITE_INTMAX_ENV=testnet
VITE_AUTO_INIT=true
```

### 5. Run the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

- `VITE_INTMAX_ENV`: Set to `testnet` or `mainnet` (default: `testnet`)
- `VITE_AUTO_INIT`: Automatically initialize the client on app load (default: `false`)

## 📱 Usage

### Getting Started

1. **Initialize Client**: Click "Initialize Client" to set up the IntMax2 connection
2. **Login**: Click "Login" to authenticate with your IntMax2 account
3. **View Balances**: Your token balances will be displayed automatically
4. **Start Transacting**: Use the various forms to deposit, transfer, or withdraw tokens

### Batch Transfer Workflow

1. **Access Batch Transfer**: Scroll to the "Batch Transfer" section
2. **Add Recipients**: 
   - Click "+ Add Transfer" to add more recipients
   - Select the token for each transfer
   - Enter recipient addresses (IntMax2 or Ethereum addresses)
   - Specify amounts for each transfer
3. **Review Summary**: The batch summary shows total amounts per token
4. **Execute**: Click "Send X Transfers" to execute all transfers at once

### Tips for Best Experience

- **Test Small Amounts**: Start with small amounts when testing
- **Check Balances**: Ensure you have sufficient balance for all transfers plus fees
- **Verify Addresses**: Double-check recipient addresses before sending
- **Monitor Transactions**: Use the transaction history to track your transfers

## 🏗️ Architecture

### Components Structure

```
src/
├── components/
│   ├── Auth/              # Authentication components
│   ├── Common/            # Reusable UI components
│   ├── Layout/            # Layout components (Header, etc.)
│   └── Wallet/            # Wallet-specific components
│       ├── BatchTransferForm.tsx  # NEW: Batch transfer functionality
│       ├── BalanceDisplay.tsx
│       ├── DepositForm.tsx
│       ├── TransferForm.tsx
│       ├── WithdrawalForm.tsx
│       └── TransactionHistory.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and constants
└── App.tsx               # Main application component
```

### Key Technologies

- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **IntMax2 SDK**: Blockchain integration
- **CSS Variables**: Modern styling with custom properties
- **Responsive Design**: Mobile-first approach

## 🎯 Supported Operations

### Single Operations
- **Deposit**: Add tokens to your IntMax2 wallet
- **Transfer**: Send tokens to another address
- **Withdraw**: Move tokens to Ethereum L1
- **Balance Check**: View current token balances

### Batch Operations
- **Batch Transfer**: Send multiple transfers in one transaction
- **Multi-token Support**: Send different tokens to different recipients
- **Cost Optimization**: Reduced transaction fees for multiple transfers

## 🔍 Troubleshooting

### Common Issues

1. **Dependencies Not Found**: Make sure to install the additional dependencies mentioned in setup
2. **SDK Not Built**: Ensure the browser-sdk is built before running the example
3. **Network Issues**: Check your internet connection and RPC endpoints
4. **Insufficient Balance**: Ensure you have enough tokens for transfers and fees

### Debug Mode

Enable debug logging by opening browser console and checking for error messages.

## 🤝 Contributing

Feel free to submit issues and enhancement requests! This example serves as a reference implementation for integrating IntMax2 SDK with modern React applications.

## 📚 Additional Resources

- [IntMax2 Documentation](https://aquatic-paperback-675.notion.site/INTMAX-Client-SDK-Integration-Guide-208d989987db809db876ff8c79e78853)
- [SDK Source Code](../../browser-sdk/)
- [Node.js Example](../node/)

## 📄 License

This project is licensed under the MIT License - see the main repository for details.
