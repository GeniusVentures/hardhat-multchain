import { extendEnvironment } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import { JsonRpcProvider } from "@ethersproject/providers";
import { lazyObject } from "hardhat/plugins";
import ChainManager from "./chainManager";
import { MultiChainProviders } from "./type-extensions";
// import "./type-extensions";

export function getProvider(networkName: string): JsonRpcProvider {
  const provider = ChainManager.getProvider(networkName);
  if (!provider) {
    throw new Error(`Provider for network ${networkName} not found`);
  }
  return provider;
}

export function getMultichainProviders(): MultiChainProviders {
  return ChainManager.getProviders();
}

export { default as multichain } from "./chainManager";

extendEnvironment((hre: HardhatRuntimeEnvironment) => {

  hre.multichain = lazyObject(()  => {
    // const provider = ChainManager.getProvider(networkName);
    // if (!provider) {
    //   throw new Error(`Provider for network ${networkName} not found`);
    // }
    return ChainManager.getProviders();
  });
  
});

task("test-multichain", "Launches multiple forked Hardhat networks")
  .addOptionalVariadicPositionalParam("testFiles", "Test files to run")
  .addOptionalParam("chains", "Comma-separated list of chain names to fork", "")
  .addOptionalParam("logs", "Log directory for forked chain output", "")
  .setAction(async ({ chains, logs, testFiles }, hre) => {
    if (!chains) {
      console.log("No secondary chains specified.");
      return;
    }

    interface TaskArgs {
      chains: string;
      logs?: string;
    }

    const chainNames: string[] = (chains as TaskArgs["chains"]).split(",").map((name: string) => name.trim());
    const logsDir: string|undefined = logs as TaskArgs["logs"] || undefined;
    if (chainNames.length > 0) {
      console.log(`🔄 Launching forks for: ${chainNames.join(", ")}`);
      await ChainManager.setupChains(chainNames, logsDir? logsDir : undefined);
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

    process.on("exit", () => {
      console.log("Exiting. Cleaning up forked networks...");
      ChainManager.cleanup();
    });

});

export {};