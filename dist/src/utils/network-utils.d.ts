/**
 * Waits for the network to be available by polling the JSON-RPC endpoint.
 * @param url - The JSON-RPC endpoint URL.
 * @param timeout - Maximum time to wait in milliseconds.
 * @returns A promise that resolves when the network is ready or rejects on timeout.
 */
declare function waitForNetwork(url: string, timeout?: number): Promise<void>;
export { waitForNetwork };
//# sourceMappingURL=network-utils.d.ts.map