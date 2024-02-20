import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';

export const replacableIndicator = 'main';

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const ROOT_FOLDER = path.join(distPath, '../../');

export const target = {
  url: `https://github.com/ntatoud/quack-starter/archive/refs/heads/${replacableIndicator}.tar.gz`,
  rootFolder: `quack-starter-${replacableIndicator}`,
};

export const spinner = ora({ text: '' });
