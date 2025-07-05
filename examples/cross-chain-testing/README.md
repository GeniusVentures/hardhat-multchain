# Cross-Chain Testing Example

This example demonstrates how to deploy and test smart contracts across multiple blockchain networks simultaneously.

## Features

- **Contract Deployment**: Deploy the same contract to multiple chains
- **Cross-Chain State Comparison**: Compare contract state across different networks
- **Gas Cost Analysis**: Compare transaction costs across L1 and L2 networks
- **Cross-Chain Integration Testing**: Test protocols that span multiple chains

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run cross-chain tests:
```bash
npx hardhat test
```

## What This Example Covers

### 1. Multi-Chain Contract Deployment
Deploy identical contracts to Ethereum, Polygon, and Arbitrum to test:
- Deployment gas costs across networks
- Contract functionality consistency
- Network-specific behaviors

### 2. Cross-Chain State Management
Test scenarios where:
- Data is stored on one chain and read from another
- State synchronization across multiple chains
- Cross-chain event monitoring

### 3. Gas Cost Comparison
Analyze:
- Deployment costs across different networks
- Transaction execution costs
- L1 vs L2 performance differences

### 4. DeFi Protocol Testing
Perfect for testing:
- Multi-chain yield farming strategies
- Cross-chain bridge protocols
- Arbitrage opportunities
- Liquidity provision across chains

## Example Use Cases

This setup is ideal for:

- **Bridge Protocols**: Test asset transfers between chains
- **Multi-Chain DApps**: Ensure consistent behavior across networks
- **Arbitrage Bots**: Test price differences and execution costs
- **Yield Strategies**: Compare farming opportunities across chains
- **Protocol Audits**: Verify security across different network conditions
