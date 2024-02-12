import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { temporaryDirectoryTask } from 'tempy';

import cli from './config/cli.js';
import { spinner } from './config/constants.js';
import {
  checkEnv,
  copyFilesToNewProject,
  downloadAndSaveRepoTar,
  extractTemplateFolder,
} from './functions.js';

const { packageInstall } = cli.flags;

export const createApp = async ({ projectName, outDirPath }) => {
  await checkEnv({ outDirPath });

  //Download zip
  let tempFilePath = await downloadAndSaveRepoTar();

  spinner.start(`Extracting template into ${outDirPath}`);

  // We use this method so the temporary diretory will be deleted after
  // the task completion
  await temporaryDirectoryTask(async (tmpDir) => {
    const extractedFolderName = await extractTemplateFolder({
      tarPath: tempFilePath,
      targetFolderPath: tmpDir,
    });

    const tmpTemplateFolder = path.join(tmpDir, extractedFolderName);
    await copyFilesToNewProject({
      fromFolderPath: tmpTemplateFolder,
      toFolderPath: outDirPath,
    });
  });

  process.chdir(outDirPath);

  spinner.succeed();

  // Block to copy the .env.example to .env
  try {
    // throw an exception if the file does not exist
    const envExampleFile = path.resolve(outDirPath, '.env.example');
    await fs.ensureFile(envExampleFile);
    await fs.copyFile(envExampleFile, path.relative(outDirPath, '.env'));
  } catch {
    // No catch, we just want to make sure the file exist.
  }

  if (packageInstall) {
    let packageManager = 'yarn';
    const pnpmLockFile = path.resolve(outDirPath, 'pnpm-lock.yaml');
    if (await fs.exists(pnpmLockFile)) {
      packageManager = 'pnpm';
    }

    spinner.start(`Installing dependencies using ${packageManager}...`);
    await execa(packageManager, ['install']);
    spinner.succeed();

    spinner.succeed(
      `${chalk.green('Project created and dependencies installed! ')}`
    );
  }

  console.log(`Created ${projectName} at ${outDirPath}`);
  console.log('');
  console.log(
    'Go into the created folder and follow getting started instruction in the README.md'
  );
};
