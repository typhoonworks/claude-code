const { test, describe } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const {
  getAvailableCategories,
  mergeSettings,
  getTotalCount,
  filterCategoriesByOptions,
} = require('../lib/config-manager');

describe('config-manager', () => {
  let tempDir;

  // Setup temp directory for testing
  test.beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'claude-config-test-'));
  });

  // Cleanup temp directory after each test
  test.afterEach(async () => {
    if (tempDir) {
      await fs.remove(tempDir);
    }
  });

  describe('getAvailableCategories', () => {
    test('should return empty categories when no directories exist', async () => {
      const categories = await getAvailableCategories(tempDir);
      assert.deepStrictEqual(categories, {});
    });

    test('should find command files in commands directory', async () => {
      const commandsDir = path.join(tempDir, 'commands');
      await fs.ensureDir(commandsDir);
      await fs.writeFile(path.join(commandsDir, 'test-command.md'), '# Test');
      await fs.writeFile(path.join(commandsDir, 'another.md'), '# Another');
      await fs.writeFile(path.join(commandsDir, 'ignore.txt'), 'ignore');

      const categories = await getAvailableCategories(tempDir);

      assert.ok(categories.commands);
      assert.strictEqual(categories.commands.length, 2);

      const commandNames = categories.commands.map(cmd => cmd.name).sort();
      assert.deepStrictEqual(commandNames, ['another', 'test-command']);

      const testCommand = categories.commands.find(
        cmd => cmd.name === 'test-command'
      );
      assert.ok(testCommand);
      assert.strictEqual(testCommand.file, 'test-command.md');
    });

    test('should find setting files in settings directory', async () => {
      const settingsDir = path.join(tempDir, 'settings');
      await fs.ensureDir(settingsDir);
      await fs.writeFile(
        path.join(settingsDir, 'test-settings.json'),
        '{"test": true}'
      );
      await fs.writeFile(path.join(settingsDir, 'ignore.txt'), 'ignore');

      const categories = await getAvailableCategories(tempDir);

      assert.ok(categories.settings);
      assert.strictEqual(categories.settings.length, 1);
      assert.strictEqual(categories.settings[0].name, 'test-settings');
      assert.strictEqual(categories.settings[0].file, 'test-settings.json');
    });

    test('should find both commands and settings', async () => {
      await fs.ensureDir(path.join(tempDir, 'commands'));
      await fs.ensureDir(path.join(tempDir, 'settings'));
      await fs.writeFile(path.join(tempDir, 'commands', 'cmd.md'), '# Cmd');
      await fs.writeFile(
        path.join(tempDir, 'settings', 'set.json'),
        '{"set": true}'
      );

      const categories = await getAvailableCategories(tempDir);

      assert.ok(categories.commands);
      assert.ok(categories.settings);
      assert.strictEqual(categories.commands.length, 1);
      assert.strictEqual(categories.settings.length, 1);
    });
  });

  describe('getTotalCount', () => {
    test('should return 0 for empty categories', () => {
      const count = getTotalCount({});
      assert.strictEqual(count, 0);
    });

    test('should count items across categories', () => {
      const categories = {
        commands: [{ name: 'cmd1' }, { name: 'cmd2' }],
        settings: [{ name: 'set1' }],
      };
      const count = getTotalCount(categories);
      assert.strictEqual(count, 3);
    });

    test('should handle undefined categories', () => {
      const categories = {
        commands: [{ name: 'cmd1' }],
        settings: undefined,
        hooks: null,
      };
      const count = getTotalCount(categories);
      assert.strictEqual(count, 1);
    });
  });

  describe('filterCategoriesByOptions', () => {
    const mockCategories = {
      commands: [{ name: 'cmd1' }, { name: 'cmd2' }],
      settings: [{ name: 'set1' }],
      hooks: [{ name: 'hook1' }],
    };

    test('should return all categories when no options specified', () => {
      const filtered = filterCategoriesByOptions(mockCategories, {});
      assert.deepStrictEqual(filtered, mockCategories);
    });

    test('should filter to only commands when commands option is true', () => {
      const filtered = filterCategoriesByOptions(mockCategories, {
        commands: true,
      });
      assert.deepStrictEqual(filtered, {
        commands: mockCategories.commands,
      });
    });

    test('should filter to only settings when settings option is true', () => {
      const filtered = filterCategoriesByOptions(mockCategories, {
        settings: true,
      });
      assert.deepStrictEqual(filtered, {
        settings: mockCategories.settings,
      });
    });

    test('should filter to both commands and settings when both options are true', () => {
      const filtered = filterCategoriesByOptions(mockCategories, {
        commands: true,
        settings: true,
      });
      assert.deepStrictEqual(filtered, {
        commands: mockCategories.commands,
        settings: mockCategories.settings,
      });
    });

    test('should handle missing categories gracefully', () => {
      const filtered = filterCategoriesByOptions(
        { commands: [{ name: 'cmd1' }] },
        { settings: true }
      );
      assert.deepStrictEqual(filtered, {});
    });
  });

  describe('mergeSettings', () => {
    test('should merge permissions arrays from source and target', async () => {
      const sourceFile = path.join(tempDir, 'source.json');
      const targetFile = path.join(tempDir, 'target.json');

      const sourceData = {
        permissions: {
          allow: ['perm1', 'perm2'],
          deny: [],
        },
      };

      const targetData = {
        permissions: {
          allow: ['perm2', 'perm3'],
          deny: [],
        },
      };

      await fs.writeJSON(sourceFile, sourceData);
      await fs.writeJSON(targetFile, targetData);

      await mergeSettings(sourceFile, targetFile);

      const result = await fs.readJSON(targetFile);
      assert.deepStrictEqual(result.permissions.allow.sort(), [
        'perm1',
        'perm2',
        'perm3',
      ]);
    });

    test('should handle source file without permissions', async () => {
      const sourceFile = path.join(tempDir, 'source.json');
      const targetFile = path.join(tempDir, 'target.json');

      const sourceData = { other: 'data' };
      const targetData = {
        permissions: {
          allow: ['perm1'],
          deny: [],
        },
      };

      await fs.writeJSON(sourceFile, sourceData);
      await fs.writeJSON(targetFile, targetData);

      await mergeSettings(sourceFile, targetFile);

      const result = await fs.readJSON(targetFile);
      assert.deepStrictEqual(result.permissions.allow, ['perm1']);
    });

    test('should handle target file without permissions', async () => {
      const sourceFile = path.join(tempDir, 'source.json');
      const targetFile = path.join(tempDir, 'target.json');

      const sourceData = {
        permissions: {
          allow: ['perm1'],
          deny: [],
        },
      };
      const targetData = { other: 'data' };

      await fs.writeJSON(sourceFile, sourceData);
      await fs.writeJSON(targetFile, targetData);

      await mergeSettings(sourceFile, targetFile);

      const result = await fs.readJSON(targetFile);
      assert.strictEqual(result.other, 'data');
      // Should not modify target if it has no permissions
    });

    test('should remove duplicates when merging permissions', async () => {
      const sourceFile = path.join(tempDir, 'source.json');
      const targetFile = path.join(tempDir, 'target.json');

      const sourceData = {
        permissions: {
          allow: ['perm1', 'perm2', 'perm1'], // duplicate
        },
      };

      const targetData = {
        permissions: {
          allow: ['perm2', 'perm3'], // perm2 duplicate with source
        },
      };

      await fs.writeJSON(sourceFile, sourceData);
      await fs.writeJSON(targetFile, targetData);

      await mergeSettings(sourceFile, targetFile);

      const result = await fs.readJSON(targetFile);
      const uniquePerms = [...new Set(result.permissions.allow)];
      assert.strictEqual(result.permissions.allow.length, uniquePerms.length);
      assert.deepStrictEqual(result.permissions.allow.sort(), [
        'perm1',
        'perm2',
        'perm3',
      ]);
    });
  });
});
