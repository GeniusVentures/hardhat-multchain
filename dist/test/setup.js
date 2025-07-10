"use strict";
// Test setup file
// This file is executed before each test file
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chainManager_1 = __importDefault(require("../src/chainManager"));
// Handle unhandled promise rejections in tests
process.on("unhandledRejection", error => {
    console.error("Unhandled promise rejection:", error);
});
// Global cleanup after all tests
afterAll(async () => {
    try {
        await chainManager_1.default.cleanup();
    }
    catch (error) {
        // Ignore cleanup errors
    }
});
//# sourceMappingURL=setup.js.map