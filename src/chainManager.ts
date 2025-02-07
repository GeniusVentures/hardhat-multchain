import { JsonRpcProvider } from "@ethersproject/providers"; // Use 'ethers' for v6, '@ethersproject/providers' for v5
import { spawn, ChildProcess } from "child_process";

class ChainManager {
  private static instances: Map<string, JsonRpcProvider> = new Map();
  private static processes: Map<string, ChildProcess> = new Map();

  static async setupChains(chains: string[]): Promise<void> {
    if (this.instances.size > 0) return;

    await Promise.all(
      chains.map(async (chainName, index) => {
        const port = 8545 + index + 1;
        const rpcUrl = process.env[`${chainName.toUpperCase()}_RPC`];
        const blockNumber = parseInt(process.env[`${chainName.toUpperCase()}_BLOCK`] || "0");

        if (!rpcUrl) {
          throw new Error(`Missing RPC URL for ${chainName}`);
        }

        console.log(`🛠️ Forking ${chainName} on port ${port}...`);

        const child = spawn(
          "npx", [
            "hardhat", 
            "node", 
            "--fork", 
            rpcUrl, 
            "--port", 
            port.toString(),
            "--blockNumber",
            blockNumber.toString()
          ],
          { stdio: "inherit" }
        );

        this.processes.set(chainName, child);

        // Wait for node to be ready
        // TODO: replace with WaitForNetwork
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        const providerUrl = 'http://127.0.0.1:' + port;
        console.log(`🔗 Connecting to ${chainName} at ${providerUrl}`);
        const provider = new JsonRpcProvider(providerUrl);
        this.instances.set(chainName, provider);
      })
    );
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
}

export default ChainManager;
