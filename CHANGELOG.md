# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-08-01

### Added

- Initial release of claude-config CLI tool
- Interactive installation with category selection
- Command-line flags for selective installation (`--commands`, `--settings`)
- Smart merging of settings files (permissions arrays)
- Dry-run mode to preview changes
- List command to show available configurations
- Update command to refresh existing configs
- Pre-commit hooks with Husky and lint-staged
- ESLint and Prettier configuration
- EditorConfig for consistent editor settings

### Included Configurations

#### Commands

- **linear-work**: Normalize Linear issue IDs and fix according to coding standards
- **sentry-debug**: Investigate and analyze Sentry issues

#### Settings

- **default-permissions**: Common permissions for Elixir/Phoenix development including:
  - Tidewave MCP tools (Ecto schemas, source location, SQL queries)
  - Linear integration (issues, teams, projects)
  - Development commands (mix test, format, credo, compile)
  - Git operations
  - npm/cargo commands

[unreleased]: https://github.com/typhoonworks/claude-config/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/typhoonworks/claude-config/releases/tag/v0.1.0
