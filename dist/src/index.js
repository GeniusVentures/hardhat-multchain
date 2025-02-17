"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multichain = void 0;
exports.getProvider = getProvider;
exports.getMultichainProviders = getMultichainProviders;
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const chainManager_1 = __importDefault(require("./chainManager"));
function getProvider(networkName) {
    const provider = chainManager_1.default.getProvider(networkName);
    if (!provider) {
        throw new Error(`Provider for network ${networkName} not found`);
    }
    return provider;
}
function getMultichainProviders() {
    return chainManager_1.default.getProviders();
}
var chainManager_2 = require("./chainManager");
Object.defineProperty(exports, "multichain", { enumerable: true, get: function () { return __importDefault(chainManager_2).default; } });
(0, config_1.extendEnvironment)((hre) => {
    hre.multichain = (0, plugins_1.lazyObject)(() => {
        return chainManager_1.default.getProviders();
    });
});
(0, config_1.extendConfig)((config, userConfig) => {
    const defaultChainManager = {
        chains: {},
    };
    config.chainManager = {
        ...defaultChainManager,
        ...userConfig.chainManager,
    };
});
(0, config_1.task)("test-multichain", "Launches multiple forked Hardhat networks")
    .addOptionalVariadicPositionalParam("testFiles", "Test files to run")
    .addParam("chains", "Comma-separated list of chain names to fork", "")
    .addOptionalParam("logs", "Log directory for forked chain output", "")
    .setAction(async ({ chains, logs, testFiles }, hre) => {
    if (!chains) {
        console.log("No secondary chains specified.");
        return;
    }
    const logsDir = logs || undefined;
    const chainNames = chains.split(",").map((name) => name.trim());
    if (chainNames.length > 0) {
        console.log(`🔄 Launching forks for: ${chainNames.join(", ")}`);
        await chainManager_1.default.setupChains(chainNames, hre.userConfig, logsDir ? logsDir : undefined);
        console.log("✅ Forked chains launched successfully.");
    }
    else {
        console.log("No valid chain names provided.");
        return;
    }
    if (testFiles && testFiles.length > 0) {
        console.log(`🧪 Running tests: ${testFiles.join(", ")}`);
        await hre.run("test", { testFiles });
    }
    else {
        console.log("No test files specified. Running all tests...");
        await hre.run("test");
    }
    process.on("exit", () => {
        console.log("Exiting. Cleaning up forked networks...");
        chainManager_1.default.cleanup();
    });
});
//# sourceMappingURL=index.js.map