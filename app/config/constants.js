import ora from 'ora';

export const replacableIndicator = 'main';

export const target = {
  url: `https://github.com/ntatoud/quack-starter/archive/refs/heads/${replacableIndicator}.tar.gz`,
  rootFolder: `quack-starter-${replacableIndicator}`,
};

export const spinner = ora({ text: '' });
