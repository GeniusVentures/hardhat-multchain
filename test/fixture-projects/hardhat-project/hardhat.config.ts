// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";
import "../../../src/type-extensions"; // Import type extensions

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  defaultNetwork: "hardhat",
  paths: {},
  chainManager: {
    chains: {
      // Example chain configurations for testing
      testnet: {
        rpcUrl: "https://sepolia.infura.io/v3/test",
        chainId: 11155111,
        blockNumber: 1000000,
      },
    },
  },
};

export default config;
