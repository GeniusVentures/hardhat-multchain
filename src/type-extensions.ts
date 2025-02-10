import "hardhat/types/config";
import "hardhat/types/runtime";
import { EthereumProvider } from "hardhat/types/provider";
import { JsonRpcProvider } from "@ethersproject/providers";
import { HardhatUserConfig } from "hardhat/types";
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
  export interface HardhatRuntimeEnvironment {
    multichain: ChainManager;
    chainManager: MultiChainConfig;
    // getProvider(newNetwork: string): JsonRpcProvider;
  }
}

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    chainManager?: MultiChainConfig;
  }

  export interface HardhatConfig {
    chainManager: MultiChainConfig;
  }
}