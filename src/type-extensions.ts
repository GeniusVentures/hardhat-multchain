import "hardhat/types/runtime";
import { EthereumProvider } from "hardhat/types/provider";
import { JsonRpcProvider } from "@ethersproject/providers";
import { HardhatUserConfig } from "hardhat/types";
import { ChainConfig } from "hardhat-multichain/src/chainManager";

declare module "hardhat/types/runtime" {

  export interface HardhatRuntimeEnvironment {
    changeNetwork(newNetwork: string): void;
    getProvider(newNetwork: string): JsonRpcProvider;
  }
}

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    chainManager?: {
      chains?: Record<string, ChainConfig>;
    };
  }
}