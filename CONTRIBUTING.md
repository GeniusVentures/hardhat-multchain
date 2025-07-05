# Contributing to Hardhat-Multichain

Thank you for your interest in contributing to hardhat-multichain! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x, 18.x, or 20.x
- npm or yarn
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/hardhat-multichain.git
   cd hardhat-multichain
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Run tests:
   ```bash
   npm test
   ```

## 📝 Development Workflow

### Code Style

We use ESLint and Prettier for code formatting. Before submitting a PR:

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Fix auto-fixable linting errors
npm run format      # Format code with Prettier
```

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

### Building

```bash
npm run build      # Build TypeScript
npm run watch      # Watch mode for development
```

## 🐛 Bug Reports

When filing a bug report, please include:

1. **Environment details**: Node.js version, operating system, hardhat version
2. **Steps to reproduce**: Clear steps to reproduce the issue
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Error messages**: Full error messages and stack traces
6. **Configuration**: Your hardhat.config.ts and any relevant environment variables

### Bug Report Template

```markdown
**Environment:**
- Node.js version: 
- Operating System: 
- Hardhat version: 
- Plugin version: 

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Error Messages:**
```
[Paste error messages here]
```

**Configuration:**
```typescript
// Your hardhat.config.ts
```
```

## ✨ Feature Requests

For feature requests, please:

1. Check existing issues to avoid duplicates
2. Clearly describe the feature and use case
3. Provide examples of how it would be used
4. Consider if it fits with the project's goals

## 🔧 Pull Requests

### Before Submitting

1. **Fork and create a branch**: Create a feature branch from `main`
2. **Write tests**: Ensure new features have appropriate test coverage
3. **Update documentation**: Update README.md and JSDoc comments as needed
4. **Follow code style**: Run linting and formatting tools
5. **Test thoroughly**: Ensure all tests pass

### Pull Request Process

1. **Title**: Use a clear, descriptive title
2. **Description**: Explain what the PR does and why
3. **Breaking changes**: Clearly mark any breaking changes
4. **Tests**: Ensure all tests pass
5. **Documentation**: Update relevant documentation

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Updated existing tests as needed

## Documentation
- [ ] Updated README.md
- [ ] Updated JSDoc comments
- [ ] Added examples if applicable

## Breaking Changes
List any breaking changes and migration steps
```

## 📚 Documentation

### Code Documentation

- Use JSDoc comments for all public APIs
- Include examples in documentation
- Keep documentation up to date with code changes

### README Updates

When updating the README:
- Keep it concise but comprehensive
- Include working examples
- Update table of contents if needed

## 🧪 Testing Guidelines

### Test Categories

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test component interactions
3. **End-to-End Tests**: Test complete workflows

### Writing Tests

- Use descriptive test names
- Test both success and failure cases
- Use appropriate setup/teardown
- Mock external dependencies appropriately

### Test Structure

```typescript
describe("Feature Name", function () {
  beforeEach(function () {
    // Setup
  });

  afterEach(function () {
    // Cleanup
  });

  describe("method name", function () {
    it("should do something specific", function () {
      // Test implementation
    });

    it("should handle error case", function () {
      // Error testing
    });
  });
});
```

## 🎯 Code Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Avoid `any` types when possible
- Provide explicit return types for public methods
- Use meaningful variable and function names

### Error Handling

- Create custom error classes for specific error types
- Provide meaningful error messages
- Include context in error messages
- Use async/await with proper try-catch blocks

### Performance Considerations

- Avoid blocking operations in the main thread
- Use appropriate timeouts for network operations
- Clean up resources properly
- Consider memory usage for long-running processes

## 🚦 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release notes
4. Tag the release
5. Publish to npm

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Discord**: Join our Discord server for real-time chat

## 📋 Project Structure

```
src/
├── chainManager.ts      # Core chain management
├── index.ts            # Main plugin entry point
└── type-extensions.ts  # TypeScript type definitions

test/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── fixtures/          # Test fixtures
└── helpers.ts         # Test utilities

examples/
├── basic-setup/       # Basic example
├── advanced-config/   # Advanced configuration
└── cross-chain/       # Cross-chain examples

docs/
├── api.md            # API documentation
├── examples.md       # Usage examples
└── troubleshooting.md # Common issues
```

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Special mentions for significant contributions

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❤️ Thank You

Thank you for contributing to hardhat-multichain! Your efforts help make multi-chain development easier for everyone.
