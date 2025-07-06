# Basic Setup Example

This example demonstrates the basic setup and usage of hardhat-multichain with two chains.

## Setup

1. Install dependencies:

```bash
npm install
```

### 2. Configure your `.env` file

```bash
cp .env.example .env
# Edit .env with your RPC URLs
```

### 3. Run the example

```bash
npx hardhat test-multichain --chains ethereum,polygon
```

## What This Example Does

- Configures two chains (Ethereum and Polygon)
- Launches forked networks
- Demonstrates basic provider usage
- Shows cross-chain contract deployment

## Files

- `hardhat.config.ts` - Configuration file
- `test/basic.test.ts` - Basic test examples
- `.env.example` - Environment variables template
