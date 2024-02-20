import fs from 'fs-extra';
import path from 'path';

import { ROOT_FOLDER } from './config/constants.js';

export function getPackageVersion() {
  const packageJsonPath = path.join(ROOT_FOLDER, 'package.json');

  const packageJsonContent = fs.readJSONSync(packageJsonPath);

  console.log(ROOT_FOLDER);
  return packageJsonContent.version ?? '1.0.0';
}
