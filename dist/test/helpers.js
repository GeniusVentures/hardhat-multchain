"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnvironment = useEnvironment;
exports.getHre = getHre;
const plugins_testing_1 = require("hardhat/plugins-testing");
const path_1 = __importDefault(require("path"));
// Global variable to store the HRE for tests
let hre;
function useEnvironment(fixtureProjectName) {
    beforeEach(() => {
        process.chdir(path_1.default.join(__dirname, "fixture-projects", fixtureProjectName));
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        hre = require("hardhat");
    });
    afterEach(() => {
        (0, plugins_testing_1.resetHardhatContext)();
    });
    return hre;
}
function getHre() {
    return hre;
}
//# sourceMappingURL=helpers.js.map