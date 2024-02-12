import chalk from 'chalk';
import meow from 'meow';

// import Link from 'terminalLink';

const flags = {
  version: {
    type: 'boolean',
    shortFlag: 'v',
  },
  packageInstall: {
    type: 'boolean',
    default: true,
  },

  help: {
    type: 'boolean',
    shortFlag: ['h'],
    default: false,
  },
};

const bold = chalk.bold;

const helpText = `
    ${bold('Usage')}
        $ create-start-ui <target> <projectPath>

    ${bold('Options')}
        -h, --help                        Show this help
        -v, --version                     Display CLI version
        --no-package-install      ${chalk.dim.italic(
          'false'
        )}   Ignore node packages install step  

    ${bold('Examples')}
        ${chalk.cyan.bold('Create a new web project')}
        $ ${chalk.dim('create-quack-starter my-web-project')}

        ${chalk.cyan.bold('Skip package installation')}
        $ ${chalk.dim(
          'create-quack-starter --no-package-install my-web-project'
        )}
`;

const options = {
  inferType: true,
  description: false,
  hardRejection: false,
  autoHelp: false,
  flags,
  importMeta: import.meta,
};

export default meow(helpText, options);
