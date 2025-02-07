import { expect } from "chai";
import sinon from "sinon";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import ChainManager from "../src/chainManager";
import "../src/index"; // Ensure the plugin is loaded
import { useEnvironment } from "./helpers";

let hre: HardhatRuntimeEnvironment;

describe("Hardhat Plugin for Multi-Fork Blockchain Networks", function () {
  
  beforeEach(function () {
    hre = {
      network: { name: "" },
      ethers: { provider: {} },
      run: sinon.stub(),
    } as unknown as HardhatRuntimeEnvironment;
  });
  
  describe("hre.changeNetwork", function () {
    useEnvironment("hardhat-project");
    it("should change the network and provider", async function () {
      const providerStub = sinon.createStubInstance(hre.ethers.providers.JsonRpcProvider);
      sinon.stub(ChainManager, "getProvider").resolves(providerStub);

      await hre.changeNetwork("testnet");

      expect(hre.network.name).to.equal("testnet");
      expect(hre.ethers.provider).to.equal(providerStub);
    });

    it("should throw an error for unknown network", async function () {
      sinon.stub(ChainManager, "getProvider").resolves(null);

      try {
        await hre.changeNetwork("unknown");
        expect.fail("Expected error was not thrown");
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).to.equal("Unknown network: unknown");
        } else {
          expect.fail("Unexpected error type");
        }
      }
    });
  });

  // describe("hre.getProvider", function () {
  //   it("should return the provider for a known network", function () {
  //     const providerStub = sinon.createStubInstance(hre.ethers.providers.JsonRpcProvider);
  //     sinon.stub(ChainManager, "getProvider").returns(providerStub);

  //     const provider = hre.getProvider("testnet");

  //     expect(provider).to.equal(providerStub);
  //   });

  //   it("should throw an error for unknown network", function () {
  //     sinon.stub(ChainManager, "getProvider").returns(undefined);

  //     try {
  //       hre.getProvider("unknown");
  //       expect.fail("Expected error was not thrown");
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         expect(error.message).to.equal("Provider for network unknown not found");
  //       } else {
  //         expect.fail("Unexpected error type");
  //       }
  //     }
  //   });
  // });

  // describe("test-multichain task", function () {
  //   it("should launch forks for specified chains and run tests", async function () {
  //     const setupChainsStub = sinon.stub(ChainManager, "setupChains").resolves();
  //     sinon.stub(hre, 'run').resolves();

  //     await hre.run("test-multichain", { chains: "sepolia,amoy", testFiles: ["test1.js", "test2.js"] });

  //     expect(setupChainsStub.calledWith(["chain1", "chain2"])).to.be.true;
  //     expect((hre.run as sinon.SinonStub).calledWith("test", { testFiles: ["test1.js", "test2.js"] })).to.be.true;
  //   });

  //   it("should run all tests if no test files are specified", async function () {
  //     const setupChainsStub = sinon.stub(ChainManager, "setupChains").resolves();
  //     sinon.stub(hre, 'run').resolves();

  //     await hre.run("test-multichain", { chains: "chain1,chain2" });

  //     expect(setupChainsStub.calledWith(["chain1", "chain2"])).to.be.true;
  //     expect((hre.run as sinon.SinonStub).calledWith("test")).to.be.true;
  //   });

  //   it("should log a message if no chains are specified", async function () {
  //     const consoleLogStub = sinon.stub(console, "log");

  //     await hre.run("test-multichain", { chains: "" });

  //     expect(consoleLogStub.calledWith("No secondary chains specified.")).to.be.true;
  //   });
  // });

  afterEach(function () {
    sinon.restore();
  });
});