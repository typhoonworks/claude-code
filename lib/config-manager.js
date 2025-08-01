const path = require('path');
const fs = require('fs-extra');

async function getAvailableCategories(configsPath) {
  const categories = {};

  // Commands
  const commandsPath = path.join(configsPath, 'commands');
  if (await fs.pathExists(commandsPath)) {
    const files = await fs.readdir(commandsPath);
    categories.commands = files
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f.replace('.md', ''),
        file: f,
        path: path.join(commandsPath, f),
      }));
  }

  // Settings
  const settingsPath = path.join(configsPath, 'settings');
  if (await fs.pathExists(settingsPath)) {
    const files = await fs.readdir(settingsPath);
    categories.settings = files
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        name: f.replace('.json', ''),
        file: f,
        path: path.join(settingsPath, f),
      }));
  }

  return categories;
}

async function mergeSettings(sourcePath, targetPath) {
  const sourceContent = await fs.readJSON(sourcePath);
  const targetContent = await fs.readJSON(targetPath);

  // Merge permissions arrays
  if (sourceContent.permissions && targetContent.permissions) {
    const mergedAllow = [
      ...new Set([
        ...(targetContent.permissions.allow || []),
        ...(sourceContent.permissions.allow || []),
      ]),
    ];

    targetContent.permissions.allow = mergedAllow;
  }

  await fs.writeJSON(targetPath, targetContent, { spaces: 2 });
}

function getTotalCount(categories) {
  return Object.values(categories).reduce(
    (sum, items) => sum + (items ? items.length : 0),
    0
  );
}

function filterCategoriesByOptions(categories, options) {
  if (!options.commands && !options.settings) {
    return categories;
  }

  const filtered = {};
  if (options.commands && categories.commands) {
    filtered.commands = categories.commands;
  }
  if (options.settings && categories.settings) {
    filtered.settings = categories.settings;
  }

  return filtered;
}

module.exports = {
  getAvailableCategories,
  mergeSettings,
  getTotalCount,
  filterCategoriesByOptions,
};
