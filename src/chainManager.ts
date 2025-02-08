import { JsonRpcProvider } from "@ethersproject/providers"; // Use 'ethers' for v6, '@ethersproject/providers' for v5
import { fork, spawn, ChildProcess } from "child_process";
// import { process } from "node:process";
// import hre from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { waitForNetwork } from "../utils/network-utils";
// import { createForkLogger } from "../utils/logger";

type ChainConfig = {
  name: string;
  rpcUrl: string;
  blockNumber?: number;
  chainId?: number;
};

class ChainManager {
  private static instances: Map<string, JsonRpcProvider> = new Map();
  private static processes: Map<string, ChildProcess> = new Map();
  
  static async setupChains(chains: string[]): Promise<void> {
    const processes: Record<string, ChildProcess> = {};
    const rpcUrls: Record<string, string> = {};
    
    await Promise.all(
      chains.map(async (chainName, index) => {
        // TODO the logger should be optional and the file location configurable
        // const logger = createForkLogger(chainName);
        const forkPort = 8546 + index;
        const chainConfig = this.getChainConfig(chainName);
        if (!chainConfig) {
          throw new Error(`Unsupported chain: ${chainName}`);
        }
        // const hre: HardhatRuntimeEnvironment = require("hardhat");

        console.log(`🛠️ Forking ${chainName} on port ${forkPort}...`);

        const child = fork("node_modules/hardhat/internal/cli/cli.js", [
            // "hardhat", 
            "node", 
            "--fork", 
            chainConfig.rpcUrl, 
            "--port", 
            forkPort.toString(),
            ...(chainConfig.blockNumber
              ? ['--fork-block-number', chainConfig.blockNumber.toString()]
              : []),
          ],
          {
            env: {
              ...process.env,
              HH_CHAIN_ID: chainConfig.chainId?.toString() || '31337',
            }
            // stdio: "inherit" // pipe to parent process
          }
        );

        // // Redirect logs to custom logger
        // child.stdout?.on('data', (data) => logger.info(data.toString()));
        // child.stderr?.on('data', (data) => logger.error(data.toString()));

        // // Handle errors
        // child.on("info", (err) => logger.info(`Log starting fork ${chainConfig.name}: ${err.message}`));        
        
        this.processes.set(chainName, child);
        
        const providerUrl = 'http://127.0.0.1:' + forkPort.toString();
 
        try {
          await this.waitForNetwork(providerUrl, 100000);
        //   console.log(`Local ${chainName} network is ready at ${rpcUrls[chainName]}.`);
        } catch (err) {
          if (err instanceof Error) {
            console.log(`Network validation failed for ${chainName}: ${err.message}`);
          } else {
            console.log(`Network validation failed for ${chainName}: ${String(err)}`);
          }
          throw err;
        }        
        
        console.log(`🔗 Connecting to ${chainName} at ${providerUrl}`);
        const provider = new JsonRpcProvider(providerUrl);
        this.instances.set(chainName, provider);
        // This may not be necessary because cleanup is handled by hardhat process
        this.processes.set(chainName, child);
      })
    )
  }
  
  private static getChainConfig(chainName: string): ChainConfig | null {
    // convert the chain config values to constants based on the chain name
    // const hre: HardhatRuntimeEnvironment = require("hardhat");
    const config = require('hardhat').config;
    const configChainId = chainName.toUpperCase() + '_MOCK_CHAIN_ID';
    const chainId = config.chainManager?.chains?.[chainName]?.chainId ?? 
      parseInt(process.env[configChainId] || "31337");
    const envRpcUrl = chainName.toUpperCase() + '_RPC';
    const rpcUrl = config.chainManager?.chains?.[chainName]?.rpcUrl ?? 
      process.env[`${envRpcUrl}`];
    if (!rpcUrl) {
      throw new Error(`Missing required rpcUrl for ${chainName} or ${chainName}_RPC in .env file.`);
    }

    const configBlockNumber = chainName.toUpperCase() + '_BLOCK_NUMBER';
    const blockNumber = config.chainManager?.chains?.[chainName]?.blockNumber ?? 
      parseInt(process.env[`${chainName.toUpperCase()}_BLOCK`] || "0");
    if (!blockNumber) {
      // TODO make optional to use file logger if it is configured
      console.log(`No fork block number configured for ${chainName} in either hardhat.config or .env file. No cache, downloading latest blocks.`);
    }

    const chainConfigs: Record<string, ChainConfig> = {
      [chainName]: {
      name: chainName,
      rpcUrl: rpcUrl!,
      blockNumber: blockNumber,
      chainId: chainId,
      },
    };
    
    return chainConfigs[chainName] || null;
  }
  
  // static async getChain(chainName: string): Promise<JsonRpcProvider> {
  //   if (this.instances.has(chainName)) {
  //     return this.instances.get(chainName)!;
  //   }

  //   const chains = await this.setupChains([chainName]);
  //   return chains.get(chainName)!;
  // }

  static getProvider(networkName: string): JsonRpcProvider | undefined {
    return this.instances.get(networkName);
  }

  static cleanup(): void {
    console.log("🧹 Cleaning up forked chains...");
    this.processes.forEach((process, name) => {
      console.log(`❌ Killing forked process for: ${name}`);
      process.kill("SIGINT");
    });
    this.processes.clear();
    this.instances.clear();
  }
  
  static  async waitForNetwork(url: string, timeout: number = 30000): Promise<void> {
    const provider = new JsonRpcProvider(url);
    const startTime = Date.now();
  
    while (Date.now() - startTime < timeout) {
      try {
        await provider.getBlockNumber(); // Check if the network is responding
        console.log(`Network at ${url} is ready.`);
        return;
      } catch (error) {
        console.log(`Waiting for network at ${url}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      }
    }
  
    throw new Error(`Network at ${url} did not respond within ${timeout}ms.`);
  }
}

export default ChainManager;
