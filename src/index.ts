// Hardhat Plugin for Multi-Fork Blockchain Networks in TypeScript
import { extendConfig, extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig, HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { fork, ChildProcess } from "child_process";
import path from "path";
import ChainManager from "./chainManager";
import { createProvider } from "hardhat/internal/core/providers/construction";
import { EthereumProvider } from "hardhat/types/provider";
import "./type-extensions";
import { JsonRpcProvider } from "ethers";
import dotenv from "dotenv";

const DEFAULT_HARDHAT_PORT = 8545;

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  hre.changeNetwork = async (networkName: string) => {
    const provider = await ChainManager.getChain(networkName);
    if (!provider) {
      throw new Error(`Unknown network: ${networkName}`);
    }

    hre.network.name = networkName;
    hre.ethers.provider = provider;
  };

  hre.getProvider = (networkName: string) => {
    return ChainManager.getChain(networkName);
  };
});

task("test-multichain", "Launches multiple forked Hardhat networks")
  .addOptionalParam("chains", "Comma-separated list of chain names to fork", "")
  .setAction(async ({ chains }, hre) => {
    if (!chains) {
      console.log("No secondary chains specified.");
      return;
    }

    interface TaskArgs {
      chains: string;
    }

    const chainNames: string[] = (chains as TaskArgs["chains"]).split(",").map((name: string) => name.trim());
    if (chainNames.length === 0) {
      console.log("No valid chain names provided.");
      return;
    }

    console.log(`🔄 Launching forks for: ${chainNames.join(", ")}`);
    await ChainManager.setupChains(chainNames);
    console.log("✅ Forked chains launched successfully.");
  });

process.on("SIGINT", () => {
  console.log("Received SIGINT. Cleaning up forked networks...");
  ChainManager.cleanup();
  process.exit(0);
});

export {};