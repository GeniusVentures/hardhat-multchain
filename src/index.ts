import { extendConfig, extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig, HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import ChainManager from "./chainManager";
import "./type-extensions";
import { JsonRpcProvider } from "@ethersproject/providers";
import "@nomiclabs/hardhat-ethers";
import { ProviderWrapper } from "hardhat/plugins";

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  // hre.changeNetwork = lazyObject(() => async (networkName: string) => {  
  hre.changeNetwork = async (networkName: string) => {
    const provider = await ChainManager.getProvider(networkName);
    if (!provider) {
      throw new Error(`Unknown network: ${networkName}`);
    }

    hre.network.name = networkName;
    hre.ethers.provider = provider as unknown as typeof hre.ethers.provider;
  };

  hre.getProvider = (networkName: string): JsonRpcProvider => {
    const provider = ChainManager.getProvider(networkName);
    if (!provider) {
      throw new Error(`Provider for network ${networkName} not found`);
    }
    return provider;
  };
});

task("test-multichain", "Launches multiple forked Hardhat networks")
  .addOptionalParam("chains", "Comma-separated list of chain names to fork", "")
  .addOptionalVariadicPositionalParam("testFiles", "Test files to run")
  .setAction(async ({ chains, testFiles }, hre) => {
    if (!chains) {
      console.log("No secondary chains specified.");
      return;
    }

    interface TaskArgs {
      chains: string;
    }

    const chainNames: string[] = (chains as TaskArgs["chains"]).split(",").map((name: string) => name.trim());
    if (chainNames.length > 0) {
      console.log(`🔄 Launching forks for: ${chainNames.join(", ")}`);
      await ChainManager.setupChains(chainNames);
      console.log("✅ Forked chains launched successfully.");
    } else {
      console.log("No valid chain names provided.");
      return;
    }
    
    if (testFiles && testFiles.length > 0) {
      console.log(`🧪 Running tests: ${testFiles.join(", ")}`);
      await hre.run("test", { testFiles });
    } else {
      console.log("No test files specified. Running all tests...");
      await hre.run("test");
    }
    
    // if (chainNames.length > 0) {
    //   console.log("🧹 Cleaning up forked networks...");
    //   ChainManager.cleanup();
    // }
  });

  
process.on("SIGINT", () => {
  console.log("Received SIGINT. Cleaning up forked networks...");
  ChainManager.cleanup();
  process.exit(0);
});

export {};