import chalk from 'chalk';
import fs, { writeFileSync } from 'fs';
import path, { join, resolve } from 'path';
import { spawnSync } from 'child_process';

export const getWindows = (dir?: string): string[] => {
  const finalDir = dir || join(process.cwd(), 'src/renderer/windows');
  if (fs.existsSync(finalDir)) {
    const dir = fs.readdirSync(finalDir);
    if (dir.includes('index')) {
      throw chalk.bgRedBright('Error') +
        ` Don't use ${chalk.red('index')} as window name. Try to remove ${chalk.red(
          'src/renderer/windows/index',
        )}.`;
    }
    return dir;
  }
  return [];
};

export const log = {
  success: (...args: string[]): void => {
    console.log(chalk.green('✔ success') + ' ' + args.join(''));
  },
  error: (...args: string[]): void => {
    console.log(chalk.red('✗ error') + ' ' + args.join(''));
  },
  info: (...args: string[]): void => {
    console.log(chalk.cyan('… info') + ' ' + args.join(''));
  },
  warn: (...args: string[]): void => {
    console.log(chalk.yellow('! warning') + ' ' + args.join(''));
  },
};

export const createVersionFile = (): { filename: string; fileContent: string } => {
  const commit = spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).stdout.replace('\n', '');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require(path.resolve(process.cwd(), 'package.json'));
  const date = new Date().toUTCString();
  return {
    filename: 'version.json',
    fileContent: JSON.stringify({ commit, version, date }),
  };
};

export const buildVersion = (): void => {
  const { filename, fileContent } = createVersionFile();
  writeFileSync(resolve(process.cwd(), `.webpack/${filename}`), fileContent, { encoding: 'utf-8' });
  log.success('Build Version.json success.');
};
