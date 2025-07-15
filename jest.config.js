module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  // Exclude problematic integration tests that hang
  testPathIgnorePatterns: [
    "/node_modules/",
  ],
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsconfig: "./tsconfig-test.json"
    }],
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 65,
      lines: 74,
      statements: 74,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  testTimeout: 30000, // Reduce timeout to 30 seconds
  setupFiles: ["<rootDir>/test/jest-setup.js"],
  maxWorkers: 1, // Run tests serially to avoid port conflicts
  detectOpenHandles: true, // Help detect async leaks
  forceExit: true, // Force exit after tests complete
};
