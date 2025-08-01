# Contributing to claude-config

Thank you for your interest in contributing to claude-config! This document provides guidelines and information for contributors.

## Quick Start

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-config.git
   cd claude-config
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run tests to ensure everything works**

   ```bash
   npm test
   ```

4. **Make your changes and test them**
   ```bash
   npm run check  # Runs linting, formatting, and tests
   ```

## Development Workflow

### Setting Up Your Environment

- **Node.js**: This project requires Node.js >= 14.0.0
- **npm**: Use npm for package management (included with Node.js)

### Making Changes

1. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards
3. **Write/update tests** for your changes
4. **Run the full test suite**:
   ```bash
   npm run check  # Linting + formatting + tests
   ```

### Testing

We use Node.js built-in test runner for fast, zero-dependency testing:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Run with coverage (experimental)
```

### Code Quality

This project maintains high code quality standards:

```bash
npm run lint          # Check linting errors
npm run lint:fix      # Auto-fix linting errors
npm run format        # Format code with Prettier
npm run format:check  # Check if code is formatted
npm run fix           # Fix linting + formatting issues
```

**Pre-commit hooks** automatically run tests and code quality checks.

## Coding Standards

### Style Guide

- **ESLint**: We use ESLint with Node.js specific rules
- **Prettier**: Code is automatically formatted with Prettier
- **EditorConfig**: Use EditorConfig for consistent editor settings

### Best Practices

- **Functions**: Keep functions small and focused
- **Error handling**: Use proper error handling with meaningful messages
- **Documentation**: Update README.md if you add new features
- **Tests**: Write tests for new functionality and bug fixes

## Adding New Configurations

If you want to add new Claude configurations to the package:

1. **Add configuration files** to the appropriate directory:
   - Commands: `configs/commands/your-command.md`
   - Settings: `configs/settings/your-settings.json`

2. **Test the new configurations**:

   ```bash
   npm run dev list                    # Should show your new configs
   npm run dev --dry-run              # Should include your configs
   npm run dev --commands --dry-run   # Test command filtering
   ```

3. **Update documentation** in README.md if needed

## Submitting Changes

### Pull Request Process

1. **Ensure your code meets quality standards**:

   ```bash
   npm run check  # Must pass
   ```

2. **Write a clear PR description** including:
   - What changes you made
   - Why you made them
   - How to test them

3. **Link any related issues** in your PR description

4. **Wait for CI to pass** - all GitHub Actions must be green

5. **Respond to review feedback** promptly

### PR Guidelines

- **One feature per PR** - keep changes focused
- **Write descriptive commit messages**
- **Update tests** for your changes
- **Update documentation** if needed

## Release Process

Releases are automated through GitHub Actions:

1. **Version bump**: Update version in `package.json`
2. **Create release**: GitHub release triggers publication
3. **Automated publishing**: Package is published to npm and GitHub Packages

## Getting Help

- **Questions**: Open a GitHub issue with the "question" label
- **Bugs**: Open a GitHub issue with the "bug" label
- **Feature requests**: Open a GitHub issue with the "enhancement" label

## Code of Conduct

This project follows GitHub's Community Guidelines. Be respectful, inclusive, and professional in all interactions.

## Development Tips

### CLI Testing

Test the CLI locally during development:

```bash
# Test basic functionality
node bin/claude-config.js --version
node bin/claude-config.js list
node bin/claude-config.js --dry-run

# Test with different flags
node bin/claude-config.js --commands --dry-run
node bin/claude-config.js --settings --dry-run
```

### Debugging

- Use `console.log()` for debugging (remove before committing)
- Test error conditions and edge cases
- Verify your changes don't break existing functionality

### Performance

- Keep CLI startup time fast
- Use efficient file operations
- Cache expensive operations when possible

## Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute! 🎉
