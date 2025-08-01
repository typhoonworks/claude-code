const { test, describe } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const path = require('path');

describe('CLI Integration Tests', () => {
  const cliPath = path.join(__dirname, '..', 'bin', 'claude-config.js');

  test('should show help when run without arguments', () => {
    try {
      const output = execSync(`node "${cliPath}" --help`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      assert.ok(output.includes('Claude Code configuration manager'));
      assert.ok(output.includes('--commands'));
      assert.ok(output.includes('--settings'));
      assert.ok(output.includes('--dry-run'));
    } catch (error) {
      assert.fail(`CLI help command failed: ${error.message}`);
    }
  });

  test('should list available configurations', () => {
    try {
      const output = execSync(`node "${cliPath}" list`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      assert.ok(output.includes('Available configurations:'));
      assert.ok(output.includes('COMMANDS'));
      assert.ok(output.includes('SETTINGS'));
    } catch (error) {
      assert.fail(`CLI list command failed: ${error.message}`);
    }
  });

  test('should show dry run output', () => {
    try {
      const output = execSync(`node "${cliPath}" --dry-run`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      assert.ok(output.includes('Dry run - would install:'));
      assert.ok(output.includes('commands'));
      assert.ok(output.includes('settings'));
    } catch (error) {
      assert.fail(`CLI dry-run command failed: ${error.message}`);
    }
  });

  test('should show filtered dry run for commands only', () => {
    try {
      const output = execSync(`node "${cliPath}" --commands --dry-run`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      assert.ok(output.includes('Dry run - would install:'));
      assert.ok(output.includes('commands'));
      assert.ok(!output.includes('settings'));
    } catch (error) {
      assert.fail(`CLI commands dry-run failed: ${error.message}`);
    }
  });

  test('should show filtered dry run for settings only', () => {
    try {
      const output = execSync(`node "${cliPath}" --settings --dry-run`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      assert.ok(output.includes('Dry run - would install:'));
      assert.ok(!output.includes('commands'));
      assert.ok(output.includes('settings'));
    } catch (error) {
      assert.fail(`CLI settings dry-run failed: ${error.message}`);
    }
  });

  test('should show version information', () => {
    try {
      const output = execSync(`node "${cliPath}" --version`, {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      assert.ok(output.includes('1.0.0'));
    } catch (error) {
      assert.fail(`CLI version command failed: ${error.message}`);
    }
  });
});
