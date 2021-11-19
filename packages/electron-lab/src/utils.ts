import chalk from 'chalk';
import fs, { existsSync, mkdirSync, writeFileSync } from 'fs';
import path, { join, resolve } from 'path';
import { spawnSync } from 'child_process';
import { EOL } from 'os';

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
  const outputPath = resolve(process.cwd(), '.webpack');
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  writeFileSync(resolve(outputPath, filename), fileContent, { encoding: 'utf-8' });
  log.success(`build ${chalk.greenBright('version.json')}  success.`);
};

export const generateMd5 = (files: string[]): void => {
  if (process.platform === 'darwin') {
    const { stdout } = spawnSync('md5', files, { encoding: 'utf-8' });
    const md5Filenames: string[] = [];
    stdout
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [, filename, md5] = line.match(/MD5 \((.+)\) = ([a-z0-9]{32})/) || [];
        return [filename, md5];
      })
      .forEach(data => {
        const [filename, md5] = data;
        const md5Filename = filename + '.md5';
        md5Filenames.push(md5Filename);
        try {
          fs.writeFileSync(md5Filename, md5.trim());
        } catch (err) {
          log.error((err as Error).stack || (err as Error).message);
        }
      });
    log.success(`build ${chalk.greenBright('md5')} success:${EOL}${md5Filenames.join(EOL)}`);
  }
  if (process.platform === 'win32') {
    const md5Filenames: string[] = [];
    files.forEach(filepath => {
      const { stdout } = spawnSync('certutil', ['-hashfile', filepath, 'MD5'], {
        encoding: 'utf-8',
      });
      const md5 = stdout.split(EOL)[1];
      const md5Filename = filepath + '.md5';
      fs.writeFileSync(md5Filename, md5.trim());
      md5Filenames.push(md5Filename);
    });
    log.success(`build ${chalk.greenBright('md5')} success:${EOL}${md5Filenames.join(EOL)}`);
  }
};
