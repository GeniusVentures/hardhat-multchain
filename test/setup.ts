// Test setup file
// This file is executed before each test file

// Handle unhandled promise rejections in tests
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

export { };
