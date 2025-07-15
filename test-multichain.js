#!/usr/bin/env node

/**
 * Test runner that simulates the test-multichain command
 * Usage: node test-multichain.js --chains mainnet,sepolia [test-file]
 */

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const chainsIndex = args.indexOf('--chains');

if (chainsIndex === -1) {
  console.error('❌ Error: --chains parameter is required');
  console.log('Usage: node test-multichain.js --chains mainnet,sepolia [test-file]');
  process.exit(1);
}

const chains = args[chainsIndex + 1];
if (!chains) {
  console.error('❌ Error: chains list is required after --chains');
  process.exit(1);
}

// Extract test file if provided
const testFile = args.find(arg => arg.endsWith('.test.ts') || arg.endsWith('.test.js'));
const testPattern = testFile || 'test/integration/multichain-pattern.test.ts';

console.log(`🚀 Starting multichain tests for chains: ${chains}`);
console.log(`📁 Test file: ${testPattern}`);

// Set environment variables for the test
process.env.MULTICHAIN_TEST_CHAINS = chains;
process.env.MULTICHAIN_TEST_MODE = 'true';

// Run the test with jest
const jestArgs = [
  '--testPathPattern=' + testPattern,
  '--verbose',
  '--no-cache',
  '--forceExit'
];

console.log(`🔧 Running: npx jest ${jestArgs.join(' ')}`);

const jest = spawn('npx', ['jest', ...jestArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    MULTICHAIN_TEST_CHAINS: chains,
    MULTICHAIN_TEST_MODE: 'true'
  }
});

jest.on('close', (code) => {
  console.log(`\n🏁 Test completed with exit code: ${code}`);
  process.exit(code);
});

jest.on('error', (error) => {
  console.error('❌ Failed to start test:', error);
  process.exit(1);
});
