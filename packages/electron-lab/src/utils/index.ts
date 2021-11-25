import chalk from 'chalk';
import fs, { existsSync, mkdirSync, writeFileSync } from 'fs';
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

type LogFunctionType = (...args: string[]) => void;

export const log: {
  success: LogFunctionType;
  error: LogFunctionType;
  info: LogFunctionType;
  warn: LogFunctionType;
} = {
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
  const outputPath = resolve(process.cwd(), '.el');
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  writeFileSync(resolve(outputPath, filename), fileContent, { encoding: 'utf-8' });
  log.success(`build ${chalk.greenBright('version.json')} success.`);
};

export const generateEntryFile = ({
  port,
  mode,
}: {
  port?: string | number;
  mode: 'production' | 'development';
}): void => {
  const windows = getWindows().concat(['index']);
  const outputPath = join(process.cwd(), '.el');
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
  if (mode === 'development') {
    const createEntryString = (name: string) => {
      return `"${name}":"http://127.0.0.1:${port}/${name}.html"`;
    };
    fs.writeFileSync(
      join(process.cwd(), '.el/entry.js'),
      `
      module.exports = {
        ${windows.map(windowName => createEntryString(windowName)).join(',\n')}
      }
    `,
    );
  } else {
    const createEntryString = (name: string) => {
      return `"${name}":\`file://\${require('path').resolve(__dirname,'./renderer/${name}.html')}\``;
    };
    fs.writeFileSync(
      join(process.cwd(), '.el/entry.js'),
      `
      module.exports = {
        ${windows.map(windowName => createEntryString(windowName)).join(',\n')}
      }
    `,
    );
  }
};
