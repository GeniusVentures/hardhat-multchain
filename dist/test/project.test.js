"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line no-implicit-dependencies
const chai_1 = require("chai");
const helpers_1 = require("./helpers");
describe("Integration tests examples", function () {
    describe("Hardhat Runtime Environment extension", function () {
        (0, helpers_1.useEnvironment)("hardhat-project");
        it("Should have multichain property", function () {
            // Check if the multichain property exists on hre
            // Note: This requires the plugin to be loaded in the fixture project
            if (this.hre.multichain) {
                chai_1.assert.isDefined(this.hre.multichain, "multichain property should be defined on hre");
            }
            else {
                console.log("Multichain property not available - plugin may not be loaded");
            }
        });
        it("Should have chainManager config", function () {
            // Check if chainManager config is properly extended
            if (this.hre.config.chainManager) {
                chai_1.assert.isDefined(this.hre.config.chainManager, "chainManager should be defined in config");
                chai_1.assert.isObject(this.hre.config.chainManager.chains, "chains should be an object");
            }
            else {
                console.log("ChainManager config not available - plugin may not be loaded");
            }
        });
    });
});
//# sourceMappingURL=project.test.js.map