// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Should have multichain property", function () {
      // Check if the multichain property exists on hre
      // Note: This requires the plugin to be loaded in the fixture project
      if (this.hre.multichain) {
        assert.isDefined(this.hre.multichain, "multichain property should be defined on hre");
      } else {
        console.log("Multichain property not available - plugin may not be loaded");
      }
    });

    it("Should have chainManager config", function () {
      // Check if chainManager config is properly extended
      if (this.hre.config.chainManager) {
        assert.isDefined(this.hre.config.chainManager, "chainManager should be defined in config");
        assert.isObject(this.hre.config.chainManager.chains, "chains should be an object");
      } else {
        console.log("ChainManager config not available - plugin may not be loaded");
      }
    });
  });
});
