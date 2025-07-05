"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../src/index");
require("../../../src/type-extensions"); // Import type extensions
const config = {
    solidity: "0.7.3",
    defaultNetwork: "hardhat",
    paths: {},
    chainManager: {
        chains: {
            // Example chain configurations for testing
            testnet: {
                rpcUrl: "https://sepolia.infura.io/v3/test",
                chainId: 11155111,
                blockNumber: 1000000
            }
        }
    }
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map