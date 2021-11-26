import chalk from 'chalk';
import fs, { existsSync, mkdirSync, writeFileSync } from 'fs';
import path, { join, resolve } from 'path';
import { spawnSync } from 'child_process';
import { DefinedHandler } from '../types';

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

type LogFunctionType = (...args: string[]) => string;

export const log: {
  success: LogFunctionType;
  error: LogFunctionType;
  info: LogFunctionType;
  warn: LogFunctionType;
} = {
  success: (...args: string[]): string => {
    const msg = chalk.green('✔ success') + ' ' + args.join('');
    console.log(msg);
    return args.join('');
  },
  error: (...args: string[]): string => {
    const msg = chalk.red('✗ error') + ' ' + args.join('');
    console.log(msg);
    return args.join('');
  },
  info: (...args: string[]): string => {
    const msg = chalk.cyan('… info') + ' ' + args.join('');
    console.log(msg);
    return args.join('');
  },
  warn: (...args: string[]): string => {
    const msg = chalk.yellow('! warning') + ' ' + args.join('');
    console.log(msg);
    return args.join('');
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
  const outputPath = resolve(process.cwd(), '.el');
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  writeFileSync(resolve(outputPath, filename), fileContent, { encoding: 'utf-8' });
  log.success(`build ${chalk.greenBright('version.json')} success.`);
};

export const generateEntryFile = (fileContent: string): void => {
  const outputPath = join(process.cwd(), '.el');
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  writeFileSync(join(outputPath, 'entry.js'), fileContent);
};

export const definedHandler: DefinedHandler = handler => handler;
