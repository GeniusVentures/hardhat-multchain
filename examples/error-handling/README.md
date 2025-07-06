# Error Handling Example

This example demonstrates how to properly handle various error scenarios when working with the hardhat-multichain plugin.

## Error Scenarios Covered

### 1. Configuration Errors

- Invalid chain names
- Missing RPC URLs
- Invalid RPC URL formats
- Invalid port numbers

### 2. Network Errors

- Unreachable RPC endpoints
- Network connection timeouts
- Invalid API keys

### 3. Process Management Errors

- Failed fork creation
- Process cleanup failures
- Resource exhaustion

### 4. Provider Errors

- Invalid provider requests
- Non-existent chain access
- Network switching failures

## Running the Examples

### 1. Install dependencies

```bash
npm install
```

### 2. Run error handling tests

```bash
npx hardhat test
```

## Best Practices Demonstrated

### Error Types

The plugin provides specific error types for different failure scenarios:

- `ChainConfigError`: Configuration and validation issues
- `NetworkConnectionError`: Network connectivity problems  
- `ProcessCleanupError`: Process management failures

### Error Handling Patterns

```typescript
try {
  await ChainManager.setupChains(chains, config);
} catch (error) {
  if (error instanceof ChainConfigError) {
    // Handle configuration errors
  } else if (error instanceof NetworkConnectionError) {
    // Handle network errors
  } else {
    // Handle unexpected errors
  }
}
```

### Graceful Degradation

- Continue with available chains when some fail
- Provide meaningful error messages
- Clean up resources on failure

## Error Recovery Strategies

1. **Retry Logic**: Implement exponential backoff for network errors
2. **Fallback RPCs**: Use backup RPC endpoints
3. **Partial Setup**: Continue with successful chains
4. **Cleanup**: Always clean up resources on failure
