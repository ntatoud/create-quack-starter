import chalk from 'chalk';
import fs from 'fs-extra';
import ky from 'ky';
import tar from 'tar';
import { temporaryFile } from 'tempy';

import { target as TARGET_INFOS, spinner } from './config/constants.js';
import { debug } from './debug.js';

export const checkEnv = async ({ outDirPath }) => {
  if (await fs.exists(outDirPath)) {
    console.log(
      `This folder may already exists: ${chalk.yellow.underline(outDirPath)}`
    );

    console.log('If this is the case, try removing it first.');
    console.log();
    process.exit(2);
  }
};

export const downloadAndSaveRepoTar = async () => {
  spinner.start('Downloading template...');
  const tempFilePath = temporaryFile();
  const repoUrl = TARGET_INFOS.url;

  try {
    debug('downloading repo tar.gz: ', repoUrl);
    const response = await ky(repoUrl, {
      responseType: 'stream',
    }).arrayBuffer();

    await fs.writeFile(tempFilePath, Buffer.from(response));
  } catch (errorDownloadingTemplate) {
    debug('Cannot download template from repository', errorDownloadingTemplate);
    spinner.fail(
      chalk.red(
        'Cannot download template from this repository. Make sure that your connection is ok or that the specified branch exists (${repoUrl}).'
      )
    );

    console.log('');
    process.exit(1);
  }
  spinner.succeed();
  return tempFilePath;
};

export const extractTemplateFolder = async ({ tarPath, targetFolderPath }) => {
  let extractedFolderName = '';

  try {
    await tar.extract({ file: tarPath, cwd: targetFolderPath });
    const files = await fs.readdir(targetFolderPath);
    extractedFolderName = files[0];
    debug('Template extracted');
  } catch (extractArchiveError) {
    debug(
      'An error occurred while extracting the template archive.',
      extractArchiveError
    );
    spinner.fail(
      chalk.red('An error occurred while extracting the template archive.')
    );
    process.exit(2);
  }

  return extractedFolderName;
};

export const copyFilesToNewProject = async ({
  fromFolderPath,
  toFolderPath,
}) => {
  try {
    try {
      await fs.rename(fromFolderPath, toFolderPath);
    } catch (renameFilesError) {
      debug('Unable to use rename(), trying alternative', renameFilesError);
      // Alternative for Microsoft partitions (copying from C: to D:)
      if (renameFilesError.code === 'EXDEV') {
        await fs.copy(fromFolderPath, toFolderPath);
        debug('Copied files from', fromFolderPath, 'to', toFolderPath);
      }
    }
  } catch (error) {
    debug('An error occurred while moving files.', error);
    spinner.fail(chalk.red('An error occurred while moving files.'));
    process.exit(3);
  }
};
