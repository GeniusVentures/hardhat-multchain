import { JsonRpcProvider } from "@ethersproject/providers";
import { HardhatUserConfig } from "hardhat/types";
import { Logger } from "winston";
import { MultiChainProviders, ChainStatus } from "./type-extensions";
export declare class ChainConfigError extends Error {
    constructor(chainName: string, issue: string);
}
export declare class NetworkConnectionError extends Error {
    readonly originalError: Error;
    constructor(url: string, originalError: Error);
}
export declare class ProcessCleanupError extends Error {
    readonly originalError: Error;
    constructor(chainName: string, originalError: Error);
}
declare class ChainManager {
    private static instances;
    private static processes;
    private static chainStatuses;
    private static forkPort;
    /**
     * Validates chain name format
     */
    private static validateChainName;
    /**
     * Validates RPC URL format
     */
    private static validateRpcUrl;
    /**
     * Validates if a port is available and in valid range
     */
    private static validatePort;
    static setupChains(chains: string[], config: HardhatUserConfig, logsDir?: string): Promise<MultiChainProviders>;
    private static getChainConfig;
    static getProvider(chainName: string): JsonRpcProvider | undefined;
    static getProviders(): MultiChainProviders;
    /**
     * Get the status of a specific chain
     */
    static getChainStatus(chainName: string): ChainStatus['status'];
    /**
     * Get detailed status information for a chain
     */
    static getChainStatusDetails(chainName: string): ChainStatus | undefined;
    /**
     * Get status for all chains
     */
    static getAllChainStatuses(): Map<string, ChainStatus>;
    /**
     * Validate network connectivity
     */
    static validateNetwork(url: string, timeout?: number): Promise<boolean>;
    static cleanup(): Promise<void>;
    static waitForNetwork(url: string, timeout?: number): Promise<void>;
    static createForkLogger: (forkName: string, logDir?: string) => Logger;
}
export default ChainManager;
//# sourceMappingURL=chainManager.d.ts.map