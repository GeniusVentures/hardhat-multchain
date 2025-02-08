# HardhatMmultichain

_A Hardhat plugin for launching multiple forked blockchains simultaneously._

[Hardhat](https://hardhat.org) plugin for managing multi-fork blockchain networks.

## What

`hardhat-multichain` allows developers to simultaneously launch multiple forked Ethereum-compatible blockchains within a Hardhat environment. It simplifies cross-chain development and testing by enabling interactions across different networks without external dependencies. Developers can fork multiple networks simultaneously, run tests against them, and ensure multi-chain compatibility for their smart contracts.

## Installation

Install the plugin via npm:

```bash
npm install hardhat-multichain
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-multichain");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-multichain";
```

## Required Plugins

This plugin requires the following Hardhat dependencies:

- [@nomiclabs/hardhat-ethers](https://github.com/NomicFoundation/hardhat/tree/main/packages/hardhat-ethers)

## Tasks

This plugin adds the `_test-multichain_` task to Hardhat:

```bash
npx hardhat help test-multichain
```

### `test-multichain` Task

This task launches multiple forked Hardhat networks and runs tests across them.

```bash
npx hardhat test-multichain --chains sepolia,amoy --testFiles test/example.test.ts
```

#### Parameters:

- `--chains` (comma-separated list): Specifies the networks to fork (e.g., `sepolia,amoy`).

Example:

```bash
npx hardhat test-multichain --chains "sepolia,amoy"

#### Additional Parameters:

- `--logs` (string): Specifies the directory to save the logs for each network.

No logs are saved by default. The logs are output to console.

Example:

```bash
npx hardhat test-multichain --chains "sepolia,amoy" --logs logs
```
## Environment Extensions

This plugin extends the Hardhat Runtime Environment (HRE) with:

- `hre.changeNetwork(networkName: string)`: Changes the active network in the Hardhat runtime.
- `hre.getProvider(networkName: string): JsonRpcProvider`: Retrieves the provider for a given network.

## Configuration

This plugin extends the Hardhat User Configuration by adding `chainManager` support. 

There are three fields that can be configured for each chain:


Chain RPC URL, a [Mock Chain ID](#mock-chain-id), and Block Number.  By defining the block number, you can specify the block at which the chain should fork and this will then be cached, as this is the behavior for Hardhat.

Example `hardhat.config.ts`:

```ts
const config = {
  ...
  chainManager: {
    chains: {
      sepolia: { rpcUrl: "https://rpc.sepolia.io", chainId: 11155111, blockNumber: 12345678 },
      amoy: { rpcUrl: "https://rpc.amoy.io", chainId: 80002, blockNumber: 12345678 },
    },
  },
  ...
};
```
### Mock Chain ID

The use of a Mock Chain ID is to allow for the use of the different chain IDs for the forks for easier identification but generally aren't required.

It requires the following configuration in the `hardhat.config.ts` file:

```ts
const config = {
  ...
    // Configuration for different networks
    networks: {
      // Hardhat's built-in local blockchain network
      hardhat: {
        chainId: MOCK_CHAIN_ID, // Sets the chain ID for the Hardhat network
        ...
      },
  };
  ...
}
```

### .env configuration

You can also configure the plugin using environment variables:

```bash
SEPOLIA_RPC=https://rpc.sepolia.io
SEPOLIA_CHAIN_ID=11155111
SEPOLIA_BLOCK=12345678
```

### Note on "Unknown" Blockchains

If you are using a blockchain that is not recognized by Hardhat (including Amoy), you will need to define the hardfork history in the `hardhat.config.ts` file. This is because Hardhat does not have a built-in hardfork history for these blockchains.

Example:

```ts
  // Configuration for different networks
  networks: {
    // Hardhat's built-in local blockchain network
    hardhat: {
      ...
      // Sets the Amoy hardfork history which is required for hardhat "unknown" networks
      80002: {
        hardforkHistory: {
          london: 10000000,
        }
      },
    },
  },
```

## Usage

After installing and configuring, simply run:

```bash
npx hardhat test-multichain --chains sepolia,amoy
```

## Code Examples

### Using available Networks

You can change the active Ethers provider in a test by using the `getProvider(<chain-name>)` function:

```ts
ethers.provider = hre.getProvider("sepolia");
```

This only changes the Ethers provider within the current scope.

### Looping through Networks

- Needs to be completed
