#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const ora = require('ora');
const {
  getAvailableCategories,
  mergeSettings,
  getTotalCount,
  filterCategoriesByOptions,
} = require('../lib/config-manager');

const program = new Command();

program
  .name('claude-config')
  .description('Claude Code configuration manager for TyphoonWorks projects')
  .version('1.0.0');

program
  .option('--commands', 'Install only commands')
  .option('--settings', 'Install only settings')
  .option('--dry-run', 'Show what would be installed without installing')
  .action(async options => {
    try {
      await installConfigs(options);
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      throw new Error(`Installation failed: ${error.message}`);
    }
  });

program
  .command('list')
  .description('List available configurations')
  .action(listConfigs);

program
  .command('update')
  .description('Update existing configurations')
  .action(updateConfigs);

async function installConfigs(options) {
  const configsPath = path.join(__dirname, '..', 'configs');
  const targetPath = path.join(process.cwd(), '.claude');

  // Ensure target directory exists
  await fs.ensureDir(targetPath);

  const categories = await getAvailableCategories(configsPath);

  if (options.dryRun) {
    showDryRun(categories, options);
    return;
  }

  // If specific categories are requested via flags
  if (options.commands || options.settings) {
    const selectedCategories = filterCategoriesByOptions(categories, options);
    await installSelectedCategories(
      selectedCategories,
      configsPath,
      targetPath
    );
    return;
  }

  // Interactive mode
  const installAll = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'installAll',
      message: `Install all Claude configurations? (${getTotalCount(categories)} items)`,
      default: true,
    },
  ]);

  if (installAll.installAll) {
    await installSelectedCategories(categories, configsPath, targetPath);
  } else {
    await interactiveInstall(categories, configsPath, targetPath);
  }
}

async function interactiveInstall(categories, configsPath, targetPath) {
  const categoryChoices = Object.keys(categories).map(cat => ({
    name: `${cat} (${categories[cat].length} items)`,
    value: cat,
  }));

  const selectedCategories = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'categories',
      message: 'Select categories to install:',
      choices: categoryChoices,
    },
  ]);

  const toInstall = {};
  for (const category of selectedCategories.categories) {
    const items = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installAll',
        message: `Install all ${category}? (${categories[category].length} items)`,
        default: true,
      },
    ]);

    if (items.installAll) {
      toInstall[category] = categories[category];
    } else {
      const itemChoices = categories[category].map(item => ({
        name: item.name,
        value: item,
      }));

      const selectedItems = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'items',
          message: `Select ${category} to install:`,
          choices: itemChoices,
        },
      ]);

      toInstall[category] = selectedItems.items;
    }
  }

  await installSelectedCategories(toInstall, configsPath, targetPath);
}

async function installSelectedCategories(categories, configsPath, targetPath) {
  const spinner = ora('Installing configurations...').start();

  try {
    for (const [categoryName, items] of Object.entries(categories)) {
      if (!items || items.length === 0) continue;

      const categoryTargetPath = path.join(targetPath, categoryName);
      await fs.ensureDir(categoryTargetPath);

      for (const item of items) {
        const targetFile = path.join(categoryTargetPath, item.file);

        if (categoryName === 'settings' && (await fs.pathExists(targetFile))) {
          await mergeSettings(item.path, targetFile);
        } else {
          await fs.copy(item.path, targetFile);
        }
      }

      spinner.text = `Installed ${items.length} ${categoryName}`;
    }

    spinner.succeed(chalk.green('Configuration installed successfully!'));

    // Show summary
    const totalInstalled = Object.values(categories).reduce(
      (sum, items) => sum + items.length,
      0
    );
    console.log(
      chalk.blue(`\nInstalled ${totalInstalled} configuration files:`)
    );

    for (const [categoryName, items] of Object.entries(categories)) {
      if (items && items.length > 0) {
        console.log(
          chalk.yellow(`  ${categoryName}:`),
          items.map(i => i.name).join(', ')
        );
      }
    }
  } catch (error) {
    spinner.fail(chalk.red('Installation failed'));
    throw error;
  }
}

function showDryRun(categories, options) {
  console.log(chalk.blue('Dry run - would install:'));

  for (const [categoryName, items] of Object.entries(categories)) {
    if (options.commands && categoryName !== 'commands') continue;
    if (options.settings && categoryName !== 'settings') continue;
    if (
      (options.commands || options.settings) &&
      categoryName !== 'commands' &&
      categoryName !== 'settings'
    )
      continue;

    if (items && items.length > 0) {
      console.log(chalk.yellow(`  ${categoryName} (${items.length} items):`));
      items.forEach(item => console.log(`    - ${item.name}`));
    }
  }
}

async function listConfigs() {
  const configsPath = path.join(__dirname, '..', 'configs');
  const categories = await getAvailableCategories(configsPath);

  console.log(chalk.blue('Available configurations:'));

  for (const [categoryName, items] of Object.entries(categories)) {
    if (items && items.length > 0) {
      console.log(
        chalk.yellow(`\n${categoryName.toUpperCase()} (${items.length} items):`)
      );
      items.forEach(item => {
        console.log(`  ${chalk.green('✓')} ${item.name}`);
      });
    }
  }
}

async function updateConfigs() {
  console.log(chalk.blue('Updating configurations...'));
  await installConfigs({ update: true });
}

program.parse();
