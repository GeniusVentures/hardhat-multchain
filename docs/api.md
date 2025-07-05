# API Documentation

## ChainManager Class

The `ChainManager` class is the core of the hardhat-multichain plugin, responsible for managing multiple blockchain forks and their providers.

### Static Methods

#### `setupChains(chains: string[], config: HardhatUserConfig, logsDir?: string): Promise<MultiChainProviders>`

Sets up multiple blockchain forks based on provided configuration.

**Parameters:**
- `chains` - Array of chain names to fork
- `config` - Hardhat user configuration containing chain settings
- `logsDir` - Optional directory for storing fork logs

**Returns:** Promise resolving to Map of chain names to JsonRpcProviders

**Throws:**
- `ChainConfigError` when chain configuration is invalid
- `NetworkConnectionError` when network connection fails

**Example:**
```typescript
const providers = await ChainManager.setupChains(['ethereum', 'polygon'], hre.userConfig);
```

#### `getProvider(chainName: string): JsonRpcProvider | undefined`

Gets a provider for a specific chain.

**Parameters:**
- `chainName` - Name of the chain to get provider for

**Returns:** JsonRpcProvider instance or undefined if chain is not found

**Example:**
```typescript
const ethProvider = ChainManager.getProvider('ethereum');
```

#### `getProviders(): MultiChainProviders`

Gets all active providers.

**Returns:** Map of chain names to JsonRpcProvider instances

**Example:**
```typescript
const allProviders = ChainManager.getProviders();
```

#### `getChainStatus(chainName: string): ChainStatus['status']`

Get the status of a specific chain.

**Parameters:**
- `chainName` - Name of the chain to check status for

**Returns:** Current status of the chain ('running' | 'stopped' | 'error' | 'unknown')

**Example:**
```typescript
const status = ChainManager.getChainStatus('ethereum');
console.log(`Ethereum status: ${status}`);
```

#### `getChainStatusDetails(chainName: string): ChainStatus | undefined`

Get detailed status information for a chain.

**Parameters:**
- `chainName` - Name of the chain to get detailed status for

**Returns:** Detailed ChainStatus object or undefined if chain not found

**Example:**
```typescript
const details = ChainManager.getChainStatusDetails('ethereum');
console.log(`Port: ${details?.port}, Chain ID: ${details?.chainId}`);
```

#### `getAllChainStatuses(): Map<string, ChainStatus>`

Get status for all chains.

**Returns:** Map of chain names to their detailed status information

**Example:**
```typescript
const allStatuses = ChainManager.getAllChainStatuses();
allStatuses.forEach((status, chainName) => {
  console.log(`${chainName}: ${status.status}`);
});
```

#### `validateNetwork(url: string, timeout?: number): Promise<boolean>`

Validate network connectivity.

**Parameters:**
- `url` - The network URL to validate
- `timeout` - Timeout in milliseconds (default: 30000)

**Returns:** Promise resolving to true if network is accessible, false otherwise

**Example:**
```typescript
const isValid = await ChainManager.validateNetwork('https://mainnet.infura.io/v3/key');
```

#### `cleanup(): Promise<void>`

Cleans up all forked processes and providers.

**Returns:** Promise that resolves when cleanup is complete

**Example:**
```typescript
await ChainManager.cleanup();
```

#### `waitForNetwork(url: string, timeout?: number): Promise<void>`

Waits for a network to become available.

**Parameters:**
- `url` - The network URL to wait for
- `timeout` - Timeout in milliseconds (default: 30000)

**Returns:** Promise that resolves when network is ready

**Throws:** `NetworkConnectionError` when network is not accessible within timeout

**Example:**
```typescript
await ChainManager.waitForNetwork('http://localhost:8545');
```

## Utility Functions

### `getProvider(networkName: string): JsonRpcProvider`

Gets a provider for a specific network, throwing an error if not found.

**Parameters:**
- `networkName` - Name of the network

**Returns:** JsonRpcProvider instance

**Throws:** Error if provider is not found

**Example:**
```typescript
import { getProvider } from 'hardhat-multichain';

const ethProvider = getProvider('ethereum');
```

### `getMultichainProviders(): MultiChainProviders`

Gets all active multichain providers.

**Returns:** Map of chain names to JsonRpcProvider instances

**Example:**
```typescript
import { getMultichainProviders } from 'hardhat-multichain';

const providers = getMultichainProviders();
```

## Error Classes

### `ChainConfigError`

Error thrown when chain configuration is invalid or missing.

**Properties:**
- `name: string` - Always 'ChainConfigError'
- `message: string` - Descriptive error message

### `NetworkConnectionError`

Error thrown when network connection fails.

**Properties:**
- `name: string` - Always 'NetworkConnectionError'
- `message: string` - Descriptive error message
- `originalError: Error` - The original error that caused the failure

### `ProcessCleanupError`

Error thrown when process cleanup fails.

**Properties:**
- `name: string` - Always 'ProcessCleanupError'
- `message: string` - Descriptive error message
- `originalError: Error` - The original error that caused the failure

## Type Definitions

### `ChainConfig`

```typescript
interface ChainConfig {
  rpcUrl: string;        // Required: RPC endpoint URL
  chainId?: number;      // Optional: Chain ID (default: 31337)
  blockNumber?: number;  // Optional: Block number to fork from
}
```

### `ChainStatus`

```typescript
interface ChainStatus {
  name: string;
  status: 'running' | 'stopped' | 'error' | 'unknown';
  port?: number;
  blockNumber?: number;
  chainId?: number;
  rpcUrl: string;
  processId?: number;
}
```

### `ValidationResult`

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

### `SetupOptions`

```typescript
interface SetupOptions {
  timeout?: number;      // Timeout in milliseconds
  retries?: number;      // Number of retry attempts
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}
```

### `MultiChainProviders`

```typescript
type MultiChainProviders = Map<string, JsonRpcProvider>;
```
