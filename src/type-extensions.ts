import "hardhat/types/runtime";
import { EthereumProvider } from "hardhat/types/provider";
import { JsonRpcProvider } from "@ethersproject/providers";
import { HardhatUserConfig } from "hardhat/types";
import ChainManager from "./chainManager";

export type ChainConfig = {
  rpcUrl: string;
  blockNumber?: number;
  chainId?: number;
};

export type MultiChainProviders = Map<string, JsonRpcProvider>;

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    multichain: ChainManager;
    // getProvider(newNetwork: string): JsonRpcProvider;
  }
  
}

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    chainManager?: {
      chains?: Record<string, ChainConfig>;
    };
  }
}