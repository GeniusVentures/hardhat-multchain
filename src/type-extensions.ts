import "hardhat/types/runtime";
import { EthereumProvider } from "hardhat/types/provider";
import { JsonRpcProvider } from "@ethersproject/providers";
import { HardhatUserConfig } from "hardhat/types";

declare module "hardhat/types/runtime" {

  export interface HardhatRuntimeEnvironment {
    changeNetwork(newNetwork: string): void;
    getProvider(newNetwork: string): JsonRpcProvider;
    getProviders(): Map<string, JsonRpcProvider>;
  }
  
  // export interface HardhatUserConfig {
  //   chainManager?: {
  //     chains: {
  //       [key: string]: {
  //         rpcUrl: string;
  //         blockNumber: number;
  //       };
  //     };
  //   };
  // }
  
  // export interface HardhatConfig {
  //   chainManager?: {
  //     chains: {
  //       [key: string]: {
  //         rpcUrl: string;
  //         chainId?: number;
  //         blockNumber?: number;
  
  //       };
  //     };
  //   };
  // }
}
