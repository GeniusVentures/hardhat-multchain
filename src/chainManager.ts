import { JsonRpcProvider } from "@ethersproject/providers"; // Use 'ethers' for v6, '@ethersproject/providers' for v5
import { fork, ChildProcess } from "child_process";
import { logger } from "ethers";
import { createLogger, format, transports, Logger } from "winston";

type ChainConfig = {
  name: string;
  rpcUrl: string;
  blockNumber?: number;
  chainId?: number;
};

class ChainManager {
  private static instances: Map<string, JsonRpcProvider> = new Map();
  private static processes: Map<string, ChildProcess> = new Map();
  
  static async setupChains(chains: string[], logsDir?: string): Promise<void> {
    const processes: Record<string, ChildProcess> = {};
    const rpcUrls: Record<string, string> = {};
    
    await Promise.all(
      chains.map(async (chainName, index) => {
        let logger: Logger | undefined;
        if (logsDir) {
          logger = this.createForkLogger(chainName, logsDir);
        } 
        // else {
        //   logger = this.createForkLogger(chainName);
        // }
        const forkPort = 8546 + index;
        const chainConfig = this.getChainConfig(chainName);
        if (!chainConfig) {
          throw new Error(`Unsupported chain: ${chainName}`);
        }

        console.log(`🛠️ Forking ${chainName} on port ${forkPort}...`);

        // TODO create a hardhat fork process more directly rather than using the CLI
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
            },
            stdio: ["pipe", "pipe", "pipe", "ipc"], // Enable stdout & stderr pipes
          }  
        );

        // TODO optionally pipe logs to log file using
        if (logger !== undefined) { 
          // Handle logs
          child.stdout?.on('data', (data) => {
            logger?.info(data.toString().trim());
          });
        
          child.stderr?.on('data', (data) => {
            // // Separate error log (There shouldn't be errors so we leave it commented out)
            // logger?.error(data.toString().trim());
            logger?.info(data.toString().trim());
          });
        
          child.on("exit", (code) => {
            logger?.info(`Forked process for ${chainConfig.name} exited with code ${code}`);
          });
        
          child.on("error", (err) => {
            // // Separate error log (There shouldn't be errors so we leave it commented out)
            // logger?.info(`Error in forked process for ${chainConfig.name}: ${err.message}`);
            
            logger?.info(`Error in forked process for ${chainConfig.name}: ${err.message}`);
          });
        }
        
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
        this.processes.set(chainName, child);
      })
    )
  }
  
  private static getChainConfig(chainName: string): ChainConfig | null {
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

  static createForkLogger = (forkName: string, logDir?: string): Logger => {
    return createLogger({
      level: "info",
      format: format.combine(
        format.colorize(),
        // // formatted with timestamp and level
        // format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        // format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`)
        
        // formatted with message only
        format.printf(({ message }) => `[${message}`)
      ),
      transports: [
        new transports.File({
          filename: logDir ? `${logDir}/${forkName}-node.log` : `./logs/${forkName}-node.log`,
          level: "info",
          options: { flags: "w" },
        }),
        // // Console logger
        // new transports.Console({
        //   format: format.combine(format.colorize(), format.simple()),
        // }),
        // // Error logger
        // new transports.File({
        //   filename: logDir ? `${logDir}/${forkName}-error.log` : `./logs/${forkName}-error.log`,
        //   level: "error",
        //   options: { flags: "w" },
        // }),
      ],
    });
  };
}

export default ChainManager;
