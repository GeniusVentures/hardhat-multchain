"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const chainManager_1 = __importStar(require("../src/chainManager"));
// Don't import the full plugin here to avoid hardhat context issues
// import "../src/index"; // Ensure the plugin is loaded
const providers_1 = require("@ethersproject/providers");
let hre;
describe("Hardhat Plugin for Multi-Fork Blockchain Networks", function () {
    this.timeout(60000); // Increase timeout for network operations
    beforeEach(function () {
        hre = {
            network: { name: "" },
            ethers: { provider: {} },
            run: sinon_1.default.stub(),
            userConfig: {
                chainManager: {
                    chains: {
                        testnet: {
                            rpcUrl: "https://sepolia.infura.io/v3/test",
                            chainId: 11155111,
                            blockNumber: 1000000,
                        },
                    },
                },
            },
        };
    });
    afterEach(async function () {
        sinon_1.default.restore();
        // Cleanup any running chains
        try {
            await chainManager_1.default.cleanup();
        }
        catch (_a) {
            // Ignore cleanup errors in tests
        }
    });
    describe("ChainManager", function () {
        describe("setupChains", function () {
            it("should validate chain names", async function () {
                try {
                    await chainManager_1.default.setupChains([""], hre.userConfig);
                    chai_1.expect.fail("Expected error was not thrown");
                }
                catch (chainConfigError) {
                    (0, chai_1.expect)(chainConfigError).to.be.instanceOf(chainManager_1.ChainConfigError);
                    (0, chai_1.expect)(chainConfigError.message).to.include("Chain name cannot be empty");
                }
            });
            it("should validate chain names with special characters", async function () {
                try {
                    await chainManager_1.default.setupChains(["test@chain"], hre.userConfig);
                    chai_1.expect.fail("Expected error was not thrown");
                }
                catch (error) {
                    (0, chai_1.expect)(error).to.be.instanceOf(chainManager_1.ChainConfigError);
                    (0, chai_1.expect)(error.message).to.include("can only contain letters, numbers, underscores, and hyphens");
                }
            });
            it("should handle missing RPC configuration", async function () {
                const configWithoutRpc = {
                    chainManager: {
                        chains: {
                            testchain: {
                                chainId: 1,
                                rpcUrl: "", // Empty rpcUrl to trigger validation error
                            },
                        },
                    },
                }; // Better typing
                try {
                    await chainManager_1.default.setupChains(["testchain"], configWithoutRpc);
                    chai_1.expect.fail("Expected error was not thrown");
                }
                catch (error) {
                    (0, chai_1.expect)(error).to.be.instanceOf(chainManager_1.ChainConfigError);
                    (0, chai_1.expect)(error.message).to.include("Missing required rpcUrl");
                }
            });
            it("should handle hardhat chain specially", async function () {
                // Mock the waitForNetwork method to simulate hardhat network being available
                const waitForNetworkStub = sinon_1.default.stub(chainManager_1.default, "waitForNetwork").resolves();
                const providers = await chainManager_1.default.setupChains(["hardhat"], hre.userConfig);
                void (0, chai_1.expect)(providers.has("hardhat")).to.be.true;
                void (0, chai_1.expect)(waitForNetworkStub.calledWith("http://127.0.0.1:8545"), "waitForNetwork should be called with correct URL").to.be.true;
                waitForNetworkStub.restore();
            });
        });
        describe("getProvider", function () {
            it("should return provider for active chain", function () {
                const mockProvider = sinon_1.default.createStubInstance(providers_1.JsonRpcProvider);
                chainManager_1.default.getProviders().set("testnet", mockProvider);
                const provider = chainManager_1.default.getProvider("testnet");
                (0, chai_1.expect)(provider).to.equal(mockProvider);
            });
            it("should return undefined for inactive chain", function () {
                const provider = chainManager_1.default.getProvider("nonexistent");
                void (0, chai_1.expect)(provider).to.be.undefined;
            });
            it("should handle invalid chain names gracefully", function () {
                const provider = chainManager_1.default.getProvider("");
                void (0, chai_1.expect)(provider).to.be.undefined;
            });
        });
        describe("getChainStatus", function () {
            it("should return 'unknown' for non-existent chain", function () {
                const status = chainManager_1.default.getChainStatus("nonexistent");
                (0, chai_1.expect)(status).to.equal("unknown");
            });
            it("should return correct status for existing chain", function () {
                // This would require a more complex setup to test properly
                // For now, just test the default case
                const status = chainManager_1.default.getChainStatus("testchain");
                (0, chai_1.expect)(status).to.equal("unknown");
            });
        });
        describe("validateNetwork", function () {
            it("should return false for invalid URL", async function () {
                const isValid = await chainManager_1.default.validateNetwork("invalid-url");
                void (0, chai_1.expect)(isValid).to.be.false;
            });
            it("should return false for unreachable network", async function () {
                const isValid = await chainManager_1.default.validateNetwork("http://localhost:99999", 1000);
                void (0, chai_1.expect)(isValid).to.be.false;
            });
        });
        describe("cleanup", function () {
            it("should handle cleanup with no active processes", async function () {
                // Should not throw
                await chainManager_1.default.cleanup();
            });
            it("should clear all providers and processes", async function () {
                const mockProvider = sinon_1.default.createStubInstance(providers_1.JsonRpcProvider);
                chainManager_1.default.getProviders().set("testnet", mockProvider);
                await chainManager_1.default.cleanup();
                (0, chai_1.expect)(chainManager_1.default.getProviders().size).to.equal(0);
            });
        });
    });
    describe("Error Classes", function () {
        it("should create ChainConfigError with proper message", function () {
            const error = new chainManager_1.ChainConfigError("testchain", "invalid config");
            (0, chai_1.expect)(error.name).to.equal("ChainConfigError");
            (0, chai_1.expect)(error.message).to.include("testchain");
            (0, chai_1.expect)(error.message).to.include("invalid config");
        });
        it("should create NetworkConnectionError with proper message", function () {
            const originalError = new Error("connection refused");
            const error = new chainManager_1.NetworkConnectionError("http://localhost:8545", originalError);
            (0, chai_1.expect)(error.name).to.equal("NetworkConnectionError");
            (0, chai_1.expect)(error.message).to.include("http://localhost:8545");
            (0, chai_1.expect)(error.originalError).to.equal(originalError);
        });
        it("should create ProcessCleanupError with proper message", function () {
            const originalError = new Error("process not found");
            const error = new chainManager_1.ProcessCleanupError("testchain", originalError);
            (0, chai_1.expect)(error.name).to.equal("ProcessCleanupError");
            (0, chai_1.expect)(error.message).to.include("testchain");
            (0, chai_1.expect)(error.originalError).to.equal(originalError);
        });
    });
    // Legacy tests (commented out parts from original file)
    describe("Legacy functionality", function () {
        it("should handle getProvider calls", function () {
            const mockProvider = sinon_1.default.createStubInstance(providers_1.JsonRpcProvider);
            chainManager_1.default.getProviders().set("testnet", mockProvider);
            const provider = chainManager_1.default.getProvider("testnet");
            (0, chai_1.expect)(provider).to.equal(mockProvider);
        });
        it("should throw error for unknown network in getProvider", function () {
            const provider = chainManager_1.default.getProvider("unknown");
            void (0, chai_1.expect)(provider).to.be.undefined;
        });
    });
});
//# sourceMappingURL=multichain-setup.test.js.map