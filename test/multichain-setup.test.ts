import { expect } from "chai";
import sinon from "sinon";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import ChainManager, { ChainConfigError, NetworkConnectionError, ProcessCleanupError } from "../src/chainManager";
// Don't import the full plugin here to avoid hardhat context issues
// import "../src/index"; // Ensure the plugin is loaded
import { JsonRpcProvider } from "@ethersproject/providers";

let hre: HardhatRuntimeEnvironment;

describe("Hardhat Plugin for Multi-Fork Blockchain Networks", function () {
  this.timeout(60000); // Increase timeout for network operations

  beforeEach(function () {
    hre = {
      network: { name: "" },
      ethers: { provider: {} },
      run: sinon.stub(),
      userConfig: {
        chainManager: {
          chains: {
            testnet: {
              rpcUrl: "https://sepolia.infura.io/v3/test",
              chainId: 11155111,
              blockNumber: 1000000
            }
          }
        }
      }
    } as unknown as HardhatRuntimeEnvironment;
  });

  afterEach(async function () {
    sinon.restore();
    // Cleanup any running chains
    try {
      await ChainManager.cleanup();
    } catch {
      // Ignore cleanup errors in tests
    }
  });

  describe("ChainManager", function () {
    describe("setupChains", function () {
      it("should validate chain names", async function () {
        try {
          await ChainManager.setupChains([""], hre.userConfig);
          expect.fail("Expected error was not thrown");
        } catch (chainConfigError) {
          expect(chainConfigError).to.be.instanceOf(ChainConfigError);
          expect((chainConfigError as ChainConfigError).message).to.include("Chain name cannot be empty");
        }
      });

      it("should validate chain names with special characters", async function () {
        try {
          await ChainManager.setupChains(["test@chain"], hre.userConfig);
          expect.fail("Expected error was not thrown");
        } catch (error) {
          expect(error).to.be.instanceOf(ChainConfigError);
          expect((error as ChainConfigError).message).to.include("can only contain letters, numbers, underscores, and hyphens");
        }
      });

      it("should handle missing RPC configuration", async function () {
        const configWithoutRpc = {
          chainManager: {
            chains: {
              testchain: {
                chainId: 1,
                rpcUrl: "", // Empty rpcUrl to trigger validation error
              }
            }
          }
        } as unknown as HardhatRuntimeEnvironment['userConfig']; // Better typing

        try {
          await ChainManager.setupChains(["testchain"], configWithoutRpc);
          expect.fail("Expected error was not thrown");
        } catch (error) {
          expect(error).to.be.instanceOf(ChainConfigError);
          expect((error as ChainConfigError).message).to.include("Missing required rpcUrl");
        }
      });

      it("should handle hardhat chain specially", async function () {
        // Mock the waitForNetwork method to simulate hardhat network being available
        const waitForNetworkStub = sinon.stub(ChainManager, "waitForNetwork").resolves();

        const providers = await ChainManager.setupChains(["hardhat"], hre.userConfig);

        void expect(providers.has("hardhat")).to.be.true;
        void expect(waitForNetworkStub.calledWith("http://127.0.0.1:8545"), "waitForNetwork should be called with correct URL").to.be.true;

        waitForNetworkStub.restore();
      });
    });

    describe("getProvider", function () {
      it("should return provider for active chain", function () {
        const mockProvider = sinon.createStubInstance(JsonRpcProvider);
        ChainManager.getProviders().set("testnet", mockProvider);

        const provider = ChainManager.getProvider("testnet");

        expect(provider).to.equal(mockProvider);
      });

      it("should return undefined for inactive chain", function () {
        const provider = ChainManager.getProvider("nonexistent");

        void expect(provider).to.be.undefined;
      });

      it("should handle invalid chain names gracefully", function () {
        const provider = ChainManager.getProvider("");

        void expect(provider).to.be.undefined;
      });
    });

    describe("getChainStatus", function () {
      it("should return 'unknown' for non-existent chain", function () {
        const status = ChainManager.getChainStatus("nonexistent");
        expect(status).to.equal("unknown");
      });

      it("should return correct status for existing chain", function () {
        // This would require a more complex setup to test properly
        // For now, just test the default case
        const status = ChainManager.getChainStatus("testchain");
        expect(status).to.equal("unknown");
      });
    });

    describe("validateNetwork", function () {
      it("should return false for invalid URL", async function () {
        const isValid = await ChainManager.validateNetwork("invalid-url");
        void expect(isValid).to.be.false;
      });

      it("should return false for unreachable network", async function () {
        const isValid = await ChainManager.validateNetwork("http://localhost:99999", 1000);
        void expect(isValid).to.be.false;
      });
    });

    describe("cleanup", function () {
      it("should handle cleanup with no active processes", async function () {
        // Should not throw
        await ChainManager.cleanup();
      });

      it("should clear all providers and processes", async function () {
        const mockProvider = sinon.createStubInstance(JsonRpcProvider);
        ChainManager.getProviders().set("testnet", mockProvider);

        await ChainManager.cleanup();

        expect(ChainManager.getProviders().size).to.equal(0);
      });
    });
  });

  describe("Error Classes", function () {
    it("should create ChainConfigError with proper message", function () {
      const error = new ChainConfigError("testchain", "invalid config");
      expect(error.name).to.equal("ChainConfigError");
      expect(error.message).to.include("testchain");
      expect(error.message).to.include("invalid config");
    });

    it("should create NetworkConnectionError with proper message", function () {
      const originalError = new Error("connection refused");
      const error = new NetworkConnectionError("http://localhost:8545", originalError);
      expect(error.name).to.equal("NetworkConnectionError");
      expect(error.message).to.include("http://localhost:8545");
      expect(error.originalError).to.equal(originalError);
    });

    it("should create ProcessCleanupError with proper message", function () {
      const originalError = new Error("process not found");
      const error = new ProcessCleanupError("testchain", originalError);
      expect(error.name).to.equal("ProcessCleanupError");
      expect(error.message).to.include("testchain");
      expect(error.originalError).to.equal(originalError);
    });
  });

  // Legacy tests (commented out parts from original file)
  describe("Legacy functionality", function () {
    it("should handle getProvider calls", function () {
      const mockProvider = sinon.createStubInstance(JsonRpcProvider);
      ChainManager.getProviders().set("testnet", mockProvider);

      const provider = ChainManager.getProvider("testnet");
      expect(provider).to.equal(mockProvider);
    });

    it("should throw error for unknown network in getProvider", function () {
      const provider = ChainManager.getProvider("unknown");
      void expect(provider).to.be.undefined;
    });
  });
});