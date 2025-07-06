# Advanced Multi-Chain Configuration Example

This example demonstrates how to set up multiple blockchain forks with complex configurations for comprehensive cross-chain testing.

## Features Demonstrated

- **6 Different Networks**: Ethereum, Polygon, Arbitrum, Optimism, BSC, and Base
- **Specific Block Numbers**: Fork from specific blocks for consistent testing
- **Environment Variable Configuration**: Use different RPC providers
- **Custom Network Settings**: Optimized for multi-chain testing

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Copy environment variables

```bash
cp .env.example .env
```

### 3. Configure your RPC endpoints

Configure Endpoints in `.env` (optional - defaults are provided)

### 4. Run the example

```bash
npx hardhat test
```

## Configuration Highlights

### Block Number Forking

```typescript
ethereum: {
  rpcUrl: process.env.ETHEREUM_RPC || "https://ethereum-rpc.publicnode.com",
  chainId: 1,
  blockNumber: 18500000, // Fork from specific block for consistency
}
```

### Multiple Networks

The configuration includes 6 different networks, each with appropriate RPC URLs and chain IDs.

### Environment Variable Support

All RPC URLs can be overridden via environment variables for flexibility across different environments.

## Best Practices Demonstrated

1. **Deterministic Testing**: Using specific block numbers ensures consistent test results
2. **Flexible Configuration**: Environment variables allow easy switching between RPC providers
3. **Resource Management**: Proper timeout settings for complex multi-chain operations
4. **Account Management**: Pre-funded test accounts for comprehensive testing

## Testing Multiple DeFi Protocols

This setup is ideal for testing:

- Cross-chain bridges
- Multi-chain yield farming strategies
- Arbitrage opportunities across networks
- Protocol deployments across different L1s and L2s

## Network Information

| Network | Chain ID | Default RPC | Block Number |
|---------|----------|-------------|--------------|
| Ethereum | 1 | ethereum-rpc.publicnode.com | 18,500,000 |
| Polygon | 137 | polygon-rpc.com | 48,000,000 |
| Arbitrum | 42161 | arb1.arbitrum.io/rpc | 140,000,000 |
| Optimism | 10 | mainnet.optimism.io | 110,000,000 |
| BSC | 56 | bsc-dataseed1.binance.org | 32,000,000 |
| Base | 8453 | mainnet.base.org | 5,000,000 |
