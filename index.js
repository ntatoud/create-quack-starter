#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import prompts from 'prompts';

import { createApp } from './app/createApp.js';
import { getPackageVersion } from './app/get-version.js';
import init from './app/init.js';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

(async () => {
  await init();
  const program = new Command()
    .name('create-quack-starter')
    .description('quickly scaffold a react project')
    .version(getPackageVersion(), '-v, --version', 'display the version number')
    .argument('[dir]', 'name of the directory to install quack.')
    .option('--package-install', 'ensures packages installation')
    .option(
      '--git-init',
      'ensures that a git repository is initated at the root of the project'
    )
    .parse(process.argv);

  let projectName = program.args[0];

  let packageInstall = program.getOptionValue('packageInstall');

  let gitInit = program.getOptionValue('gitInit');

  if (!projectName) {
    const res = await prompts({
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
    });

    if (typeof res.path === 'string') {
      projectName = res.path.trim();
    }
  }

  if (!packageInstall) {
    const { packageInstall: res } = await prompts({
      type: 'toggle',
      name: 'packageInstall',
      message: `Would you like us to run package installation ?`,
      active: 'Yes',
      inactive: 'No',
    });
    packageInstall = res;
  }

  if (!gitInit) {
    const { gitInit: res } = await prompts({
      type: 'toggle',
      name: 'gitInit',
      message: `Would you like us to init a git repository ?`,
      active: 'Yes',
      inactive: 'No',
    });
    gitInit = res;
  }

  const projectDirectory = path.resolve(process.cwd(), projectName);
  await createApp({
    projectName,
    outDirPath: projectDirectory,
    options: {
      packageInstall,
      gitInit,
    },
  });
})();
