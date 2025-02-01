// Hardhat Plugin for Multi-Fork Blockchain Networks in TypeScript
import { task } from "hardhat/config";
import { fork, ChildProcess } from "child_process";
import path from "path";

const DEFAULT_HARDHAT_PORT = 8545;

function launchForkedChain(chainName: string, port: number): ChildProcess {
  const childProcess = fork(require.resolve("hardhat"), ["node"], {
    env: {
      ...process.env,
      HARDHAT_NETWORK: chainName,
      HARDHAT_PORT: port.toString(),
    },
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  childProcess.on("error", (err) => {
    console.error(`Error launching chain ${chainName}:`, err);
  });

  childProcess.on("exit", (code, signal) => {
    if (code) {
      console.warn(`Chain ${chainName} exited with code ${code}.`);
    } else if (signal) {
      console.warn(`Chain ${chainName} was terminated with signal ${signal}.`);
    }
  });

  return childProcess;
}

task("run-multichain", "Launches multiple forked Hardhat networks")
  .addOptionalParam("multichain", "Comma-separated list of chain names to fork", "")
  .setAction(async ({ multichain }, hre) => {
    if (!multichain) {
      console.log("No secondary chains specified.");
      return;
    }

    const chainNames = multichain.split(",").map((name) => name.trim());
    if (chainNames.length === 0) {
      console.log("No valid chain names provided.");
      return;
    }

    const childProcesses: { chainName: string; port: number; process: ChildProcess }[] = [];
    const abortController = new AbortController();

    try {
      chainNames.forEach((chainName, index) => {
        const port = DEFAULT_HARDHAT_PORT + index + 1;
        console.log(`Starting chain ${chainName} on port ${port}...`);
        const child = launchForkedChain(chainName, port);
        childProcesses.push({ chainName, port, process: child });
      });

      // Listen for parent process termination to clean up child processes
      process.on("SIGINT", () => abortController.abort());
      process.on("SIGTERM", () => abortController.abort());

      await new Promise<void>((resolve) => {
        abortController.signal.addEventListener("abort", () => {
          console.log("Cleaning up child processes...");
          childProcesses.forEach(({ chainName, process: child }) => {
            console.log(`Terminating chain ${chainName}...`);
            child.kill("SIGTERM");
          });
          resolve();
        });

        console.log("All chains are running. Press Ctrl+C to terminate.");
      });
    } catch (error) {
      console.error("An error occurred while launching chains:", error);
    } finally {
      childProcesses.forEach(({ chainName, process: child }) => {
        console.log(`Terminating chain ${chainName}...`);
        child.kill("SIGTERM");
      });
    }
  });

export {};
