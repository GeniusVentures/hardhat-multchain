"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("@ethersproject/providers"); // Use 'ethers' for v6, '@ethersproject/providers' for v5
const child_process_1 = require("child_process");
const hardhat_1 = __importDefault(require("hardhat"));
const winston_1 = require("winston");
class ChainManager {
    static async setupChains(chains, logsDir) {
        if (this.instances.size > 0)
            return this.instances;
        const processes = {};
        const rpcUrls = {};
        await Promise.all(chains.map(async (chainName, index) => {
            var _a, _b, _c;
            let logger;
            if (logsDir) {
                logger = this.createForkLogger(chainName, logsDir);
            }
            // Check for hardhat chain and make the provider localhost (127.0.0.1:8545)
            if (chainName === "hardhat") {
                const providerUrl = 'http://127.0.0.1:8545';
                console.log(`🔗 Default ${chainName} provider as ${providerUrl} with Hardhat-Multichain`);
                const provider = new providers_1.JsonRpcProvider(providerUrl);
                this.instances.set(chainName, provider);
                return;
            }
            this.forkPort = this.forkPort + index;
            const chainConfig = this.getChainConfig(chainName);
            if (!chainConfig) {
                throw new Error(`Unsupported chain: ${chainName}`);
            }
            console.log(`🛠️ Forking ${chainName} on port ${this.forkPort}...`);
            // TODO create a hardhat fork process more directly rather than using the CLI
            const child = (0, child_process_1.fork)("node_modules/hardhat/internal/cli/cli.js", [
                "node",
                "--fork",
                chainConfig.rpcUrl,
                "--port",
                this.forkPort.toString(),
                ...(chainConfig.blockNumber
                    ? ['--fork-block-number', chainConfig.blockNumber.toString()]
                    : []),
            ], {
                env: {
                    ...process.env,
                    HH_CHAIN_ID: ((_a = chainConfig.chainId) === null || _a === void 0 ? void 0 : _a.toString()) || '31337',
                },
                stdio: ["pipe", "pipe", "pipe", "ipc"], // Enable stdout & stderr pipes
            });
            if (logger !== undefined) {
                // Handle logs
                (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
                    logger === null || logger === void 0 ? void 0 : logger.info(data.toString().trim());
                });
                (_c = child.stderr) === null || _c === void 0 ? void 0 : _c.on('data', (data) => {
                    // // Separate error log (There shouldn't be errors so we leave it commented out)
                    // logger?.error(data.toString().trim());
                    logger === null || logger === void 0 ? void 0 : logger.info(data.toString().trim());
                });
                child.on("exit", (code) => {
                    logger === null || logger === void 0 ? void 0 : logger.info(`Forked process for ${chainName} exited with code ${code}`);
                });
                child.on("error", (err) => {
                    // // Separate error log (There shouldn't be errors so we leave it commented out)
                    // logger?.info(`Error in forked process for ${chainConfig.name}: ${err.message}`);
                    logger === null || logger === void 0 ? void 0 : logger.info(`Error in forked process for ${chainName}: ${err.message}`);
                });
            }
            this.processes.set(chainName, child);
            const providerUrl = 'http://127.0.0.1:' + this.forkPort.toString();
            try {
                await this.waitForNetwork(providerUrl, 100000);
                //   console.log(`Local ${chainName} network is ready at ${rpcUrls[chainName]}.`);
            }
            catch (err) {
                if (err instanceof Error) {
                    console.log(`Network validation failed for ${chainName}: ${err.message}`);
                }
                else {
                    console.log(`Network validation failed for ${chainName}: ${String(err)}`);
                }
                throw err;
            }
            console.log(`🔗 Connecting to ${chainName} at ${providerUrl}`);
            const provider = new providers_1.JsonRpcProvider(providerUrl);
            this.instances.set(chainName, provider);
        }));
        return this.instances;
    }
    static getChainConfig(chainName) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const config = hardhat_1.default.userConfig;
        const configChainId = chainName.toUpperCase() + '_MOCK_CHAIN_ID';
        const chainId = (_d = (_c = (_b = (_a = config.chainManager) === null || _a === void 0 ? void 0 : _a.chains) === null || _b === void 0 ? void 0 : _b[chainName]) === null || _c === void 0 ? void 0 : _c.chainId) !== null && _d !== void 0 ? _d : parseInt(process.env[configChainId] || "31337");
        const envRpcUrl = chainName.toUpperCase() + '_RPC';
        const rpcUrl = (_h = (_g = (_f = (_e = config.chainManager) === null || _e === void 0 ? void 0 : _e.chains) === null || _f === void 0 ? void 0 : _f[chainName]) === null || _g === void 0 ? void 0 : _g.rpcUrl) !== null && _h !== void 0 ? _h : process.env[`${envRpcUrl}`];
        if (!rpcUrl) {
            throw new Error(`Missing required rpcUrl for ${chainName} or ${chainName}_RPC in .env file.`);
        }
        const configBlockNumber = chainName.toUpperCase() + '_BLOCK_NUMBER';
        const blockNumber = (_m = (_l = (_k = (_j = config.chainManager) === null || _j === void 0 ? void 0 : _j.chains) === null || _k === void 0 ? void 0 : _k[chainName]) === null || _l === void 0 ? void 0 : _l.blockNumber) !== null && _m !== void 0 ? _m : parseInt(process.env[`${chainName.toUpperCase()}_BLOCK`] || "0");
        if (!blockNumber) {
            // TODO make optional to use file logger if it is configured
            console.log(`No fork block number configured for ${chainName} in either hardhat.config or .env file. No cache, downloading latest blocks.`);
        }
        const chainConfigs = {
            [chainName]: {
                rpcUrl: rpcUrl,
                blockNumber: blockNumber,
                chainId: chainId,
            },
        };
        return chainConfigs[chainName] || null;
    }
    static getProvider(chainName) {
        return this.instances.get(chainName);
    }
    static getProviders() {
        return this.instances;
    }
    static cleanup() {
        console.log("🧹 Cleaning up forked chains...");
        this.processes.forEach((process, name) => {
            console.log(`💀 Killing forked process for: ${name}`);
            process.kill("SIGINT");
        });
        this.processes.clear();
        this.instances.clear();
    }
    static async waitForNetwork(url, timeout = 30000) {
        const provider = new providers_1.JsonRpcProvider(url);
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            try {
                await provider.getBlockNumber(); // Check if the network is responding
                console.log(`Network at ${url} is ready.`);
                return;
            }
            catch (error) {
                console.log(`⏱ Waiting for network at ${url}...`);
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            }
        }
        throw new Error(`Network at ${url} did not respond within ${timeout}ms.`);
    }
}
ChainManager.instances = new Map();
ChainManager.processes = new Map();
ChainManager.forkPort = 8546;
ChainManager.createForkLogger = (forkName, logDir) => {
    return (0, winston_1.createLogger)({
        level: "info",
        format: winston_1.format.combine(winston_1.format.colorize(), 
        // // formatted with timestamp and level
        // format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        // format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`)
        // formatted with message only
        winston_1.format.printf(({ message }) => `[${message}`)),
        transports: [
            new winston_1.transports.File({
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
exports.default = ChainManager;
//# sourceMappingURL=chainManager.js.map