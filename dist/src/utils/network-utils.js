"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForNetwork = void 0;
// import { ethers } from "ethers";
const providers_1 = require("@ethersproject/providers");
/**
 * Waits for the network to be available by polling the JSON-RPC endpoint.
 * @param url - The JSON-RPC endpoint URL.
 * @param timeout - Maximum time to wait in milliseconds.
 * @returns A promise that resolves when the network is ready or rejects on timeout.
 */
async function waitForNetwork(url, timeout = 30000) {
    const provider = new providers_1.JsonRpcProvider(url);
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            await provider.getBlockNumber(); // Check if the network is responding
            console.log(`Network at ${url} is ready.`);
            return;
        }
        catch (error) {
            console.log(`Waiting for network at ${url}...`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
    }
    throw new Error(`Network at ${url} did not respond within ${timeout}ms.`);
}
exports.waitForNetwork = waitForNetwork;
//# sourceMappingURL=network-utils.js.map