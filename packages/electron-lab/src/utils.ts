import chalk from 'chalk';
import fs from 'fs';
import { join } from 'path';

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
    console.log(chalk.bgGreenBright(chalk.black('Success')) + ' ' + args.join(''));
  },
  error: (...args: string[]): void => {
    console.log(chalk.bgRedBright('Error') + ' ' + args.join(''));
  },
  info: (...args: string[]): void => {
    console.log(chalk.bgCyanBright('Info') + ' ' + args.join(''));
  },
  warn: (...args: string[]): void => {
    console.log(chalk.bgYellowBright(chalk.black('Warning')) + ' ' + args.join(''));
  },
};
