# Troubleshooting Guide

This guide covers common issues you might encounter when using hardhat-multichain and how to resolve them.

## Common Issues

### Network Connection Issues

#### Problem: Network connection timeouts

```text
Error: Failed to connect to network at http://localhost:8547
```

**Possible Causes:**

- RPC endpoint is not accessible
- Network is temporarily down
- Firewall blocking connections
- Rate limiting by RPC provider

**Solutions:**

1. **Check RPC URL**: Verify your RPC URLs are correct and accessible

   ```bash
   curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' YOUR_RPC_URL
   ```

2. **Increase timeout**: Configure longer timeouts in your setup

   ```typescript
   await ChainManager.waitForNetwork(url, 60000); // 60 seconds
   ```

3. **Check network connectivity**: Ensure your internet connection is stable

4. **Verify API keys**: Ensure your Infura/Alchemy/etc. API keys are valid

#### Problem: RPC rate limiting

```text
Error: Too many requests
```

**Solutions:**

1. **Use multiple RPC endpoints**: Configure fallback RPC URLs
2. **Implement retry logic**: Add delays between requests
3. **Upgrade RPC plan**: Use a higher tier plan with your provider

### Port Issues

#### Problem: Port already in use

```text
Error: Port 8547 is already in use
```

**Solutions:**

1. **Kill existing processes**: Find and terminate processes using the port

   ```bash
   lsof -ti:8547 | xargs kill -9
   ```

2. **Use different ports**: The plugin automatically increments ports, but you can manually configure them

3. **Cleanup previous instances**: Ensure proper cleanup of previous test runs

   ```typescript
   await ChainManager.cleanup();
   ```

### Configuration Issues

#### Problem: Missing RPC configuration

```text
Error: Missing required rpcUrl for ethereum
```

**Solutions:**

1. **Check hardhat.config.ts**:

   ```typescript
   export default {
     chainManager: {
       chains: {
         ethereum: {
           rpcUrl: "https://mainnet.infura.io/v3/YOUR_KEY",
           chainId: 1
         }
       }
     }
   };
   ```

2. **Check environment variables**:

   ```bash
   # .env file
   ETHEREUM_RPC=https://mainnet.infura.io/v3/YOUR_KEY
   ```

3. **Verify environment variable names**: Use the correct format `CHAINNAME_RPC`

#### Problem: Invalid chain configuration

```text
Error: Chain 'test@chain' configuration error: Chain name can only contain letters, numbers, underscores, and hyphens
```

**Solutions:**

1. **Use valid chain names**: Only use letters, numbers, underscores, and hyphens

   ```typescript
   // Good
   const chains = ['ethereum', 'polygon', 'arbitrum_one'];
   
   // Bad
   const chains = ['ethereum!', 'polygon@mainnet', 'arbitrum.one'];
   ```

### Process Management Issues

#### Problem: Zombie processes

```text
Warning: Process cleanup incomplete
```

**Solutions:**

1. **Proper cleanup**: Always call cleanup in your test teardown

   ```typescript
   afterEach(async () => {
     await ChainManager.cleanup();
   });
   ```

2. **Handle process signals**: Ensure cleanup on process termination

   ```typescript
   process.on('SIGINT', async () => {
     await ChainManager.cleanup();
     process.exit(0);
   });
   ```

3. **Manual cleanup**: Kill processes manually if needed

   ```bash
   ps aux | grep hardhat | grep -v grep | awk '{print $2}' | xargs kill -9
   ```

### Memory Issues

#### Problem: High memory usage

```text
Error: JavaScript heap out of memory
```

**Solutions:**

1. **Increase Node.js memory**: Use the `--max-old-space-size` flag

   ```bash
   node --max-old-space-size=4096 node_modules/.bin/hardhat test-multichain
   ```

2. **Limit concurrent chains**: Don't fork too many chains simultaneously

3. **Cleanup regularly**: Ensure proper cleanup between test runs

4. **Use specific block numbers**: Fork from specific blocks to reduce memory usage

   ```typescript
   ethereum: {
     rpcUrl: "https://mainnet.infura.io/v3/KEY",
     blockNumber: 18000000  // Specific block
   }
   ```

### Testing Issues

#### Problem: Tests failing intermittently

```text
Error: Provider for network ethereum not found
```

**Solutions:**

1. **Ensure proper setup**: Use the test-multichain task

   ```bash
   npx hardhat test-multichain --chains ethereum,polygon
   ```

2. **Wait for network readiness**: Add delays in tests if needed

   ```typescript
   before(async function() {
     await new Promise(resolve => setTimeout(resolve, 5000));
   });
   ```

3. **Check chain status**: Verify chains are running before tests

   ```typescript
   const status = ChainManager.getChainStatus('ethereum');
   expect(status).to.equal('running');
   ```

### TypeScript Issues

#### Problem: Type errors

```text
Error: Property 'chainManager' does not exist on type 'HardhatUserConfig'
```

**Solutions:**

1. **Import type extensions**: Ensure types are imported

   ```typescript
   import "hardhat-multichain";
   ```

2. **Check tsconfig.json**: Ensure proper TypeScript configuration

3. **Restart TypeScript server**: In VSCode, run "TypeScript: Restart TS Server"

## Debugging Tips

### Enable Debug Logging

1. **Use the logs parameter**:

   ```bash
   npx hardhat test-multichain --chains ethereum --logs ./debug-logs
   ```

2. **Check log files**: Review generated log files for detailed information

### Network Validation

Test network connectivity before setup:

```typescript
const isValid = await ChainManager.validateNetwork('https://mainnet.infura.io/v3/KEY');
if (!isValid) {
  console.log('Network not accessible');
}
```

### Status Monitoring

Monitor chain status during execution:

```typescript
const statuses = ChainManager.getAllChainStatuses();
console.log('Chain statuses:', statuses);
```

## Performance Optimization

### Reduce Fork Time

1. **Use specific block numbers**: Avoid downloading entire chain state
2. **Cache RPC responses**: Use local caching if possible
3. **Limit chain count**: Only fork chains you actually need

### Memory Optimization

1. **Fork from recent blocks**: Older blocks require more data
2. **Use lightweight RPC providers**: Some providers are faster than others
3. **Cleanup between tests**: Don't let providers accumulate

## Getting Help

If you encounter issues not covered in this guide:

1. **Check existing issues**: Search the GitHub repository for similar problems
2. **Create a detailed issue**: Include configuration, error messages, and steps to reproduce
3. **Provide environment info**: Node.js version, operating system, etc.

### Issue Template

```markdown
**Environment:**
- Node.js version: 
- Operating System: 
- Hardhat version: 
- Plugin version: 

**Configuration:**
```typescript
// Your hardhat.config.ts
```

**Error Message:**

```text
Paste full error message here
```

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
What you expected to happen

**Actual Behavior:**
What actually happened
