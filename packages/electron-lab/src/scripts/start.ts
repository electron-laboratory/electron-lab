/* eslint-disable @typescript-eslint/no-var-requires */
import proc, { ChildProcess } from 'child_process';
import electron from 'electron';
import { join, resolve } from 'path';
import { buildVersion, generateEntryFile, log } from '../utils';
import yParser from 'yargs-parser';
const args = yParser(process.argv.slice(2));

import { FatherBuildCli, WatchReturnType } from '../fatherCli';

const FROM_TEST = !!process.env.FROM_TEST;

const fatherBuildCli = new FatherBuildCli({});

const appPath = resolve(process.cwd());

buildVersion();

const engineName = args.engine || 'default';

const engine = require(join(__dirname, '../engines', engineName)).default;

if (!engine) {
  throw new Error(log.error(`cannot found engine \`${engineName}\`!`));
}

generateEntryFile(engine.getEntry('development'));

class ElectronProcessManager {
  electronProcess: ChildProcess | undefined;
  start() {
    this.kill();
    const childProc = proc.spawn(
      (electron as unknown) as string,
      args.inspect ? [`--inspect=${args.inspect}`, appPath] : [appPath],
      {
        stdio: 'pipe',
        env: {
          ...process.env,
          FORCE_COLOR: '1',
        },
      },
    );

    log.success(`run electron.${args.inspect ? ` inspecting in port ${args.inspect}...` : ''}`);
    if (args.inspect) {
      log.info(
        `electron main process inspect document: https://www.electronjs.org/zh/docs/latest/tutorial/debugging-main-process`,
      );
    }
    if (FROM_TEST) {
      childProc.kill();
      fatherBuildWatcher.exit();
      process.exit(0);
    }

    childProc.on('error', err => {
      log.error(err.message);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      childProc.kill();
      process.exit(1);
    });

    childProc.stdout?.pipe(process.stdout);
    childProc.stderr?.pipe(process.stderr);

    this.electronProcess = childProc;
  }

  kill() {
    this.electronProcess?.kill();
  }
}

const manager = new ElectronProcessManager();

let fatherBuildWatcher: WatchReturnType;

engine?.start(() => {
  log.success(`starting renderer server on`);
  log.info(`running main process compiler...`);
  fatherBuildWatcher = fatherBuildCli.watch({
    onBuild: () => {
      manager.start();
    },
  });
});

const exit = async () => {
  manager.kill();
  fatherBuildWatcher?.exit();
  process.exit(0);
};

process.on('SIGINT', () => {
  // exit from terminal
  exit();
});

process.on('beforeExit', () => {
  exit();
});

process.on('unhandledRejection', () => process.exit(1));
process.on('uncaughtException', () => process.exit(1));
