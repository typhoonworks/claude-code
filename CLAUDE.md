# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **@typhoonworks/claude-config**, a Node.js CLI tool that installs Claude Code configurations for TyphoonWorks projects. It manages two types of configurations:

- **Commands**: Custom Claude Code commands (stored as .md files)
- **Settings**: Permission configurations (stored as JSON files)

The tool provides both interactive and non-interactive installation modes with smart merging capabilities.

## Development Commands

### Testing

```bash
npm test              # Run tests using Node.js built-in test runner
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Code Quality

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
npm run check         # Run all checks (lint + format + test)
npm run fix           # Fix all issues (lint:fix + format)
```

### Local Development

```bash
npm run dev           # Run CLI locally (same as npm start)
npm start             # Run CLI locally: node bin/claude-config.js

# Examples:
npm run dev -- list
npm run dev -- --dry-run
npm start -- --commands --settings
```

## Architecture

### Core Components

- **bin/claude-config.js**: CLI entry point using Commander.js with interactive prompts via Inquirer
- **lib/config-manager.js**: Core logic for discovering, filtering, and merging configuration files
- **configs/**: Template configurations to be installed
  - **configs/commands/**: Command templates (`.md` files with frontmatter)
  - **configs/settings/**: Setting templates (JSON files with permissions)

### Key Functions

- **getAvailableCategories()**: Scans configs directory and builds category structure
- **mergeSettings()**: Smart merging of permission JSON files (merges `allow` arrays)
- **filterCategoriesByOptions()**: Filters categories based on CLI flags
- **installSelectedCategories()**: Handles file copying with merge logic

### Installation Logic

1. **Settings files**: Uses smart merging - combines permission arrays rather than overwriting
2. **Command files**: Direct copy (existing files preserved, new ones added)
3. **Target structure**: Creates `.claude/commands/` and `.claude/settings/` in user projects

## Configuration Templates

### Command Template Format

Commands use markdown with YAML frontmatter:

```yaml
---
description: 'Command description'
argument-hint: '[argName]'
---
Command content with {{args.argName}} substitution
```

### Settings Template Format

JSON files containing Claude Code permissions:

```json
{
  "permissions": {
    "allow": ["Bash(git:*)", "WebFetch(domain:github.com)"],
    "deny": []
  }
}
```

## Pre-commit Hooks

The project uses Husky and lint-staged:

- **ESLint**: Automatic fixing and validation
- **Prettier**: Code formatting
- **Tests**: Must pass before commit
- **Scope**: Only runs on staged files

## Release Process

- Version bumps: `npm version patch|minor|major`
- GitHub Actions handles automated npm publishing
- Update CHANGELOG.md for each release
- CI must pass before publishing
