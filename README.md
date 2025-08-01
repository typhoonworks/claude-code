# @typhoonworks/claude-config

Claude Code configuration manager for TypeScript/Elixir projects.

## Quick Start

Install configurations to your project:

```bash
npx @typhoonworks/claude-config
```

## Usage

### Default Installation (Interactive)

```bash
npx @typhoonworks/claude-config
```

This will:

1. Ask if you want to install all configurations
2. If not, let you select categories (commands, settings)
3. For each category, choose to install all or select individual items

### Install Specific Categories

```bash
# Install only commands
npx @typhoonworks/claude-config --commands

# Install only settings
npx @typhoonworks/claude-config --settings

# Install both commands and settings
npx @typhoonworks/claude-config --commands --settings
```

### Preview Mode

See what would be installed without actually installing:

```bash
npx @typhoonworks/claude-config --dry-run
npx @typhoonworks/claude-config --commands --dry-run
```

### List Available Configurations

```bash
npx @typhoonworks/claude-config list
```

### Update Existing Configurations

```bash
npx @typhoonworks/claude-config update
```

## What's Included

### Commands

- **linear-work**: Normalize Linear issue IDs and fix according to coding standards
- **sentry-debug**: Investigate and analyze Sentry issues

### Settings

- **default-permissions**: Common permissions for Elixir/Phoenix development including:
  - Tidewave MCP tools (Ecto schemas, source location, SQL queries)
  - Linear integration (issues, teams, projects)
  - Development commands (mix test, format, credo, compile)
  - Git operations
  - npm/cargo commands

## File Structure

After installation, your `.claude` directory will contain:

```
.claude/
├── commands/
│   ├── linear-work.md
│   └── sentry-debug.md
└── settings/
    └── default-permissions.json
```

## Smart Merging

- **Settings files**: Permissions are merged, not overwritten
- **Command files**: Existing commands are preserved, new ones are added
- **Conflict resolution**: Interactive prompts for handling conflicts

## Requirements

- Node.js >= 14.0.0
- Claude Code CLI

## Development

### Setup

```bash
git clone https://github.com/typhoonworks/claude-config.git
cd claude-config
npm install
```

### Scripts

```bash
# Run the CLI locally
npm run dev -- list
npm start -- --dry-run

# Code quality
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
npm run check         # Run all checks (lint + format)
npm run fix           # Fix all issues (lint:fix + format)

# Testing
npm test              # Run tests using Node.js built-in test runner
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Prepare for publishing
npm run prepack       # Runs checks before packaging
```

### Pre-commit Hooks

This project uses Husky and lint-staged to run quality checks on commit:

- **Tests**: Full test suite must pass
- **ESLint**: JavaScript linting and fixes
- **Prettier**: Code formatting
- **Pre-commit hook**: Prevents commits with test failures or linting errors

### Code Quality Tools

- **Node.js built-in test runner**: Zero-dependency testing with modern features
- **ESLint**: JavaScript linting with Node.js specific rules
- **Prettier**: Code formatting with consistent style
- **Husky**: Git hooks management
- **lint-staged**: Run tools on staged files only
- **EditorConfig**: Consistent editor settings

### Test Coverage

The test suite includes:

- **Unit tests**: Core configuration management functions
- **Integration tests**: CLI command functionality
- **File system tests**: Configuration file discovery and merging
- **Error handling**: Edge cases and invalid inputs

## Release Process

This project uses automated releases through GitHub:

### For Maintainers

1. **Update version**: `npm version patch|minor|major`
2. **Update CHANGELOG.md**: Add entry for new version
3. **Commit changes**: `git add . && git commit -m "chore: release v1.x.x"`
4. **Create release**: Use GitHub UI or `gh release create v1.x.x`
5. **Automatic publishing**: GitHub Actions will publish to npm if version is new

### Version Management

- **Patch** (1.0.1): Bug fixes, small improvements
- **Minor** (1.1.0): New features, backwards compatible
- **Major** (2.0.0): Breaking changes

### Automated Safeguards

- ✅ **CI must pass** before publishing
- ✅ **Version validation** ensures package.json matches release tag
- ✅ **Duplicate prevention** skips publishing if version already exists
- ✅ **Manual override** available via workflow dispatch for emergencies

## License

MIT
