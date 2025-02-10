import "hardhat/types/config";
import "hardhat/types/runtime";
import { JsonRpcProvider } from "@ethersproject/providers";
import ChainManager from "./chainManager";
export interface ChainConfig {
    rpcUrl: string;
    blockNumber?: number;
    chainId?: number;
}
export interface MultiChainConfig {
    chains: Record<string, ChainConfig>;
}
export interface TaskArgs {
    chains: string;
    logs?: string;
}
export type MultiChainProviders = Map<string, JsonRpcProvider>;
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        multichain: ChainManager;
        chainManager: MultiChainConfig;
    }
}
declare module "hardhat/types/config" {
    interface HardhatUserConfig {
        chainManager?: MultiChainConfig;
    }
    interface HardhatConfig {
        chainManager: MultiChainConfig;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map