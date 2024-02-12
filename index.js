#!/usr/bin/env node
import path from 'node:path';

import cli from './app/config/cli.js';
import { createApp } from './app/createApp.js';
import init from './app/init.js';
import log from './app/log.js';

const input = cli.input;
const flags = cli.flags;
const { debug, help } = flags;

(async () => {
  await init();
  help && cli.showHelp(0);
  debug && log(flags);
  // Get the project name (should be the first argument)
  const [projectName] = input;

  if (!projectName) {
    cli.showHelp(0);
  }

  const projectDirectory = path.resolve(process.cwd(), projectName);
  await createApp({ projectName, outDirPath: projectDirectory });
})();
