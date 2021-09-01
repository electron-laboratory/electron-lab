import yParser from 'yargs-parser';
import chalk from 'chalk';
import { fork } from 'child_process';
import { resolve } from 'path';

import './beforeStart';

// 配置检查
const args = yParser(process.argv.slice(2));

switch (args._[0]) {
  case 'start': {
    const proc = fork(resolve(__dirname, './scripts/start.js'), { cwd: process.cwd() });
    proc.on('exit', () => {
      process.kill(0);
    });
    break;
  }
  case 'build': {
    const proc = fork(resolve(__dirname, './scripts/build.js'), { cwd: process.cwd() });
    proc.on('exit', () => {
      process.kill(0);
    });
    break;
  }
  default:
    throw chalk.red(`unrecognized command ${args._[0]}`);
}
