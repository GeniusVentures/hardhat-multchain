# Usage Examples

This document provides comprehensive examples of how to use hardhat-multichain in various scenarios.

## Basic Setup

### Simple Two-Chain Setup

```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/types";
import "hardhat-multichain";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  chainManager: {
    chains: {
      ethereum: {
        rpcUrl: "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
        chainId: 1,
        blockNumber: 18500000
      },
      polygon: {
        rpcUrl: "https://polygon-rpc.com",
        chainId: 137,
        blockNumber: 50000000
      }
    }
  }
};

export default config;
```

### Running Tests

```bash
# Launch chains and run all tests
npx hardhat test-multichain --chains ethereum,polygon

# Run specific test files
npx hardhat test-multichain --chains ethereum,polygon test/crosschain.test.ts

# Enable logging
npx hardhat test-multichain --chains ethereum,polygon --logs ./logs
```

## Advanced Configuration

### Multiple Chains with Environment Variables

```bash
# .env file
ETHEREUM_RPC=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
ETHEREUM_BLOCK=18500000
POLYGON_RPC=https://polygon-rpc.com
POLYGON_BLOCK=50000000
ARBITRUM_RPC=https://arb1.arbitrum.io/rpc
ARBITRUM_BLOCK=150000000
OPTIMISM_RPC=https://mainnet.optimism.io
OPTIMISM_BLOCK=110000000
```

```typescript
// hardhat.config.ts
const config: HardhatUserConfig = {
  chainManager: {
    chains: {
      ethereum: {
        rpcUrl: process.env.ETHEREUM_RPC!,
        chainId: 1,
        blockNumber: parseInt(process.env.ETHEREUM_BLOCK || "0")
      },
      polygon: {
        rpcUrl: process.env.POLYGON_RPC!,
        chainId: 137,
        blockNumber: parseInt(process.env.POLYGON_BLOCK || "0")
      },
      arbitrum: {
        rpcUrl: process.env.ARBITRUM_RPC!,
        chainId: 42161,
        blockNumber: parseInt(process.env.ARBITRUM_BLOCK || "0")
      },
      optimism: {
        rpcUrl: process.env.OPTIMISM_RPC!,
        chainId: 10,
        blockNumber: parseInt(process.env.OPTIMISM_BLOCK || "0")
      }
    }
  }
};
```

## Cross-Chain Testing

### Basic Cross-Chain Contract Deployment

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { getProvider } from "hardhat-multichain";

describe("Cross-Chain Contract Deployment", function () {
  let ethereumProvider: any;
  let polygonProvider: any;

  before(async function () {
    // Get providers for each chain
    ethereumProvider = getProvider("ethereum");
    polygonProvider = getProvider("polygon");
  });

  it("should deploy contract on multiple chains", async function () {
    // Contract factory and deployment on Ethereum
    const ContractFactory = await ethers.getContractFactory("MyContract");
    
    // Deploy to Ethereum
    const ethereumSigner = ethereumProvider.getSigner();
    const ethereumContract = await ContractFactory.connect(ethereumSigner).deploy();
    await ethereumContract.deployed();
    
    // Deploy to Polygon
    const polygonSigner = polygonProvider.getSigner();
    const polygonContract = await ContractFactory.connect(polygonSigner).deploy();
    await polygonContract.deployed();

    // Verify deployments
    expect(ethereumContract.address).to.be.properAddress;
    expect(polygonContract.address).to.be.properAddress;
    
    console.log(`Ethereum deployment: ${ethereumContract.address}`);
    console.log(`Polygon deployment: ${polygonContract.address}`);
  });
});
```

### Cross-Chain State Verification

```typescript
describe("Cross-Chain State Verification", function () {
  it("should verify contract state across chains", async function () {
    const ethereumProvider = getProvider("ethereum");
    const polygonProvider = getProvider("polygon");

    // Get block numbers from both chains
    const ethBlockNumber = await ethereumProvider.getBlockNumber();
    const polyBlockNumber = await polygonProvider.getBlockNumber();

    console.log(`Ethereum block: ${ethBlockNumber}`);
    console.log(`Polygon block: ${polyBlockNumber}`);

    // Verify both chains are responding
    expect(ethBlockNumber).to.be.greaterThan(0);
    expect(polyBlockNumber).to.be.greaterThan(0);
  });
});
```

## Provider Management

### Getting Specific Providers

```typescript
import { getProvider, getMultichainProviders } from "hardhat-multichain";

// Get a specific provider
const ethereumProvider = getProvider("ethereum");
const balance = await ethereumProvider.getBalance("0x...address");

// Get all providers
const allProviders = getMultichainProviders();
for (const [chainName, provider] of allProviders) {
  const blockNumber = await provider.getBlockNumber();
  console.log(`${chainName}: Block ${blockNumber}`);
}
```

### Chain Status Monitoring

```typescript
import ChainManager from "hardhat-multichain/dist/src/chainManager";

// Check individual chain status
const ethereumStatus = ChainManager.getChainStatus("ethereum");
console.log(`Ethereum status: ${ethereumStatus}`);

// Get detailed status information
const ethereumDetails = ChainManager.getChainStatusDetails("ethereum");
if (ethereumDetails) {
  console.log(`Port: ${ethereumDetails.port}`);
  console.log(`Chain ID: ${ethereumDetails.chainId}`);
  console.log(`RPC URL: ${ethereumDetails.rpcUrl}`);
}

// Monitor all chains
const allStatuses = ChainManager.getAllChainStatuses();
allStatuses.forEach((status, chainName) => {
  console.log(`${chainName}: ${status.status} (Port: ${status.port})`);
});
```

## Error Handling

### Handling Configuration Errors

```typescript
import { ChainConfigError, NetworkConnectionError } from "hardhat-multichain";

try {
  await ChainManager.setupChains(["ethereum", "polygon"], config);
} catch (error) {
  if (error instanceof ChainConfigError) {
    console.error("Configuration issue:", error.message);
    // Handle missing RPC URLs, invalid chain names, etc.
  } else if (error instanceof NetworkConnectionError) {
    console.error("Network connectivity issue:", error.message);
    console.error("Original error:", error.originalError);
    // Handle network timeouts, unreachable RPC endpoints, etc.
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### Network Validation

```typescript
// Validate networks before setup
const networks = ["ethereum", "polygon", "arbitrum"];
const validations = await Promise.all(
  networks.map(async (network) => {
    const rpcUrl = process.env[`${network.toUpperCase()}_RPC`];
    if (!rpcUrl) return { network, valid: false, error: "Missing RPC URL" };
    
    try {
      const isValid = await ChainManager.validateNetwork(rpcUrl, 10000);
      return { network, valid: isValid };
    } catch (error) {
      return { network, valid: false, error: error.message };
    }
  })
);

const validNetworks = validations
  .filter(v => v.valid)
  .map(v => v.network);

console.log("Valid networks:", validNetworks);
```

## Advanced Use Cases

### Custom Test Setup

```typescript
// test/setup.ts
import ChainManager from "hardhat-multichain/dist/src/chainManager";

export async function setupTestChains() {
  const chains = ["ethereum", "polygon"];
  const config = require("../hardhat.config").default;
  
  console.log("Setting up test chains...");
  const providers = await ChainManager.setupChains(chains, config, "./test-logs");
  
  // Wait for all chains to be ready
  for (const chainName of chains) {
    let attempts = 0;
    while (attempts < 30) {
      const status = ChainManager.getChainStatus(chainName);
      if (status === "running") break;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    if (ChainManager.getChainStatus(chainName) !== "running") {
      throw new Error(`Chain ${chainName} failed to start`);
    }
  }
  
  console.log("All chains ready!");
  return providers;
}

export async function cleanupTestChains() {
  console.log("Cleaning up test chains...");
  await ChainManager.cleanup();
  console.log("Cleanup complete!");
}
```

### Performance Testing

```typescript
describe("Performance Tests", function () {
  it("should setup chains within time limit", async function () {
    const startTime = Date.now();
    
    await ChainManager.setupChains(["ethereum", "polygon"], config);
    
    const setupTime = Date.now() - startTime;
    console.log(`Setup time: ${setupTime}ms`);
    
    // Should setup within 30 seconds
    expect(setupTime).to.be.lessThan(30000);
  });
  
  it("should cleanup within time limit", async function () {
    await ChainManager.setupChains(["ethereum", "polygon"], config);
    
    const startTime = Date.now();
    await ChainManager.cleanup();
    const cleanupTime = Date.now() - startTime;
    
    console.log(`Cleanup time: ${cleanupTime}ms`);
    
    // Should cleanup within 10 seconds
    expect(cleanupTime).to.be.lessThan(10000);
  });
});
```

### Concurrent Chain Operations

```typescript
describe("Concurrent Operations", function () {
  it("should handle concurrent provider requests", async function () {
    const ethereumProvider = getProvider("ethereum");
    const polygonProvider = getProvider("polygon");
    
    // Perform concurrent operations
    const operations = await Promise.all([
      ethereumProvider.getBlockNumber(),
      polygonProvider.getBlockNumber(),
      ethereumProvider.getGasPrice(),
      polygonProvider.getGasPrice()
    ]);
    
    const [ethBlock, polyBlock, ethGas, polyGas] = operations;
    
    expect(ethBlock).to.be.greaterThan(0);
    expect(polyBlock).to.be.greaterThan(0);
    expect(ethGas.gt(0)).to.be.true;
    expect(polyGas.gt(0)).to.be.true;
  });
});
```

## Integration with Other Tools

### Using with Hardhat Deploy

```typescript
// deploy/001_deploy_contracts.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getProvider } from "hardhat-multichain";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Deploy on multiple chains
  const chains = ["ethereum", "polygon"];
  
  for (const chainName of chains) {
    console.log(`Deploying to ${chainName}...`);
    
    const provider = getProvider(chainName);
    const signer = provider.getSigner(deployer);
    
    const deployment = await deploy("MyContract", {
      from: deployer,
      args: [],
      log: true,
    });
    
    console.log(`${chainName} deployment:`, deployment.address);
  }
};

export default func;
func.tags = ["MyContract"];
```

### Using with Mocha Hooks

```typescript
// test/hooks.ts
import { getMultichainProviders } from "hardhat-multichain";

// Global setup
before(async function () {
  this.timeout(60000); // Increase timeout for setup
  
  console.log("Starting multichain test environment...");
  
  // Providers are set up by test-multichain task
  const providers = getMultichainProviders();
  console.log(`Available chains: ${Array.from(providers.keys()).join(", ")}`);
});

// Global cleanup
after(async function () {
  // Cleanup is handled by test-multichain task
  console.log("Test environment cleanup complete");
});
```

## Best Practices

### Test Organization

```typescript
// test/multichain/
// ├── setup.ts           # Common setup utilities
// ├── ethereum.test.ts   # Ethereum-specific tests
// ├── polygon.test.ts    # Polygon-specific tests
// └── crosschain.test.ts # Cross-chain interaction tests

// test/multichain/setup.ts
export const CHAIN_CONFIGS = {
  ethereum: { expectedChainId: 1 },
  polygon: { expectedChainId: 137 },
};

export async function verifyChainSetup(chainName: string) {
  const provider = getProvider(chainName);
  const network = await provider.getNetwork();
  const expectedChainId = CHAIN_CONFIGS[chainName]?.expectedChainId;
  
  if (expectedChainId && network.chainId !== expectedChainId) {
    throw new Error(`Chain ID mismatch for ${chainName}`);
  }
  
  return true;
}
```

### Resource Management

```typescript
// Always cleanup in test lifecycle
describe("Resource Management", function () {
  let providers: Map<string, any>;
  
  before(async function () {
    // Setup is handled by test-multichain task
    providers = getMultichainProviders();
  });
  
  after(async function () {
    // Explicit cleanup if needed
    if (providers.size > 0) {
      await ChainManager.cleanup();
    }
  });
  
  // Individual test cleanup
  afterEach(function () {
    // Reset any test-specific state
  });
});
```
