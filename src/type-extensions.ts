import "hardhat/types/runtime";
import { EthereumProvider } from "hardhat/types/provider";
import { JsonRpcProvider } from "@ethersproject/providers";

declare module "hardhat/types/runtime" {

  export interface HardhatRuntimeEnvironment {
    changeNetwork(newNetwork: string): void;
    getProvider(newNetwork: string): JsonRpcProvider;
    getProviders(): Map<string, JsonRpcProvider>;
  }
}
