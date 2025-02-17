import { extendEnvironment, extendConfig, task } from "hardhat/config";
import { HardhatRuntimeEnvironment, HardhatUserConfig } from "hardhat/types";
import { JsonRpcProvider } from "@ethersproject/providers";
import { lazyObject } from "hardhat/plugins";
import ChainManager from "./chainManager";
import { MultiChainProviders, MultiChainConfig, TaskArgs } from "./type-extensions"; // Import MultiChainConfig

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
  hre.multichain = lazyObject(() => {
    return ChainManager.getProviders();
  });
});

extendConfig((config, userConfig) => {
  const defaultChainManager: MultiChainConfig = {
    chains: {},
  };

  config.chainManager = {
    ...defaultChainManager,
    ...userConfig.chainManager,
  };
});

task("test-multichain", "Launches multiple forked Hardhat networks")
  .addOptionalVariadicPositionalParam("testFiles", "Test files to run")
  .addParam("chains", "Comma-separated list of chain names to fork", "")
  .addOptionalParam("logs", "Log directory for forked chain output", "")
  .setAction(async ({ chains, logs, testFiles }, hre) => {
    if (!chains) {
      console.log("No secondary chains specified.");
      return;
    }
    const logsDir: string|undefined = logs as TaskArgs["logs"] || undefined;

    const chainNames: string[] = (chains as TaskArgs["chains"]).split(",").map((name: string) => name.trim());
    if (chainNames.length > 0) {
      console.log(`🔄 Launching forks for: ${chainNames.join(", ")}`);
      await ChainManager.setupChains(chainNames, hre.userConfig, logsDir? logsDir : undefined);
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