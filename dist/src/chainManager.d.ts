import { JsonRpcProvider } from "@ethersproject/providers";
import { Logger } from "winston";
import { MultiChainProviders } from "./type-extensions";
declare class ChainManager {
    private static instances;
    private static processes;
    private static forkPort;
    static setupChains(chains: string[], logsDir?: string): Promise<MultiChainProviders>;
    private static getChainConfig;
    static getProvider(chainName: string): JsonRpcProvider | undefined;
    static getProviders(): MultiChainProviders;
    static cleanup(): void;
    static waitForNetwork(url: string, timeout?: number): Promise<void>;
    static createForkLogger: (forkName: string, logDir?: string) => Logger;
}
export default ChainManager;
//# sourceMappingURL=chainManager.d.ts.map