import { JsonRpcProvider } from "@ethersproject/providers";
import { HardhatUserConfig } from "hardhat/types";
import { Logger } from "winston";
import { MultiChainProviders, ChainStatus } from "./type-extensions";
/**
 * Error thrown when chain configuration is invalid or missing
 */
export declare class ChainConfigError extends Error {
    constructor(chainName: string, issue: string);
}
/**
 * Error thrown when network connection fails
 */
export declare class NetworkConnectionError extends Error {
    readonly originalError: Error;
    constructor(url: string, originalError: Error);
}
/**
 * Error thrown when process cleanup fails
 */
export declare class ProcessCleanupError extends Error {
    readonly originalError: Error;
    constructor(chainName: string, originalError: Error);
}
/**
 * ChainManager is responsible for managing multiple blockchain forks and their providers.
 * It handles the lifecycle of forked processes, network validation, and provider management.
 *
 * @example
 * ```typescript
 * // Setup multiple chains
 * const providers = await ChainManager.setupChains(['ethereum', 'polygon'], config);
 *
 * // Get a specific provider
 * const ethProvider = ChainManager.getProvider('ethereum');
 *
 * // Check chain status
 * const status = ChainManager.getChainStatus('ethereum');
 *
 * // Cleanup when done
 * await ChainManager.cleanup();
 * ```
 */
declare class ChainManager {
    private static instances;
    private static processes;
    private static chainStatuses;
    private static forkPort;
    /**
     * Validates chain name format and constraints
     * @param chainName The chain name to validate
     * @returns ValidationResult with errors and warnings
     */
    private static validateChainName;
    /**
     * Validates RPC URL format and protocol
     * @param url The RPC URL to validate
     * @returns ValidationResult with errors and warnings
     */
    private static validateRpcUrl;
    /**
     * Validates if a port is available and in valid range
     * @param port The port number to validate
     * @returns ValidationResult with errors and warnings
     */
    private static validatePort;
    /**
     * Sets up multiple blockchain forks based on provided configuration
     * @param chains Array of chain names to fork
     * @param config Hardhat user configuration containing chain settings
     * @param logsDir Optional directory for storing fork logs
     * @returns Promise resolving to Map of chain names to JsonRpcProviders
     * @throws ChainConfigError when chain configuration is invalid
     * @throws NetworkConnectionError when network connection fails
     */
    static setupChains(chains: string[], config: HardhatUserConfig, logsDir?: string): Promise<MultiChainProviders>;
    /**
     * Retrieves chain configuration from Hardhat config or environment variables
     * @param chainName Name of the chain to get configuration for
     * @param config Hardhat user configuration
     * @returns ChainConfig object or null if not found
     * @throws ChainConfigError when configuration is invalid or missing
     */
    private static getChainConfig;
    /**
     * Gets a provider for a specific chain
     * @param chainName Name of the chain to get provider for
     * @returns JsonRpcProvider instance or undefined if chain is not found
     */
    static getProvider(chainName: string): JsonRpcProvider | undefined;
    /**
     * Gets all active providers
     * @returns Map of chain names to JsonRpcProvider instances
     */
    static getProviders(): MultiChainProviders;
    /**
     * Get the status of a specific chain
     * @param chainName Name of the chain to check status for
     * @returns Current status of the chain
     */
    static getChainStatus(chainName: string): ChainStatus["status"];
    /**
     * Get detailed status information for a chain
     * @param chainName Name of the chain to get detailed status for
     * @returns Detailed ChainStatus object or undefined if chain not found
     */
    static getChainStatusDetails(chainName: string): ChainStatus | undefined;
    /**
     * Get status for all chains
     * @returns Map of chain names to their detailed status information
     */
    static getAllChainStatuses(): Map<string, ChainStatus>;
    /**
     * Validate network connectivity
     * @param url The network URL to validate
     * @param timeout Timeout in milliseconds (default: 30000)
     * @returns Promise resolving to true if network is accessible, false otherwise
     */
    static validateNetwork(url: string, timeout?: number): Promise<boolean>;
    /**
     * Cleans up all forked processes and providers
     * @returns Promise that resolves when cleanup is complete
     */
    static cleanup(): Promise<void>;
    /**
     * Waits for a network to become available
     * @param url The network URL to wait for
     * @param timeout Timeout in milliseconds (default: 30000)
     * @returns Promise that resolves when network is ready
     * @throws NetworkConnectionError when network is not accessible within timeout
     */
    static waitForNetwork(url: string, timeout?: number): Promise<void>;
    /**
     * Creates a winston logger instance for a specific fork
     * @param forkName Name of the fork to create logger for
     * @param logDir Optional directory to store logs (default: ./logs)
     * @returns Winston Logger instance
     */
    static createForkLogger: (forkName: string, logDir?: string) => Logger;
}
export default ChainManager;
//# sourceMappingURL=chainManager.d.ts.map