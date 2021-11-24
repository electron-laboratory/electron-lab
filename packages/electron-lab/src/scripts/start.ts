/* eslint-disable @typescript-eslint/no-var-requires */
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import proc, { ChildProcess } from 'child_process';
import electron from 'electron';
import { resolve, join } from 'path';
import { merge } from 'webpack-merge';
import { buildVersion, generateEntryFile, log } from '../utils';
import { getUserConfig } from '../config';
import yParser from 'yargs-parser';
import { FatherBuildCli, WatchReturnType } from '../fatherCli';

const FROM_TEST = !!process.env.FROM_TEST;

const configPath = resolve(__dirname, '../../config');
const rendererConfig = require(join(configPath, './webpack.config'));
const userConfig = getUserConfig();

const fatherBuildCli = new FatherBuildCli({});

let { port } = rendererConfig.devServer;
const appPath = resolve(process.cwd());

buildVersion();

// command line options
const args = yParser(process.argv.slice(2));
if (args.port) {
  port = args.port;
}
generateEntryFile({ port: port as string, mode: 'development' });
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

    childProc.on('spawn', () => {
      log.success(`run electron.${args.inspect ? ` inspecting in port ${args.inspect}...` : ''}`);
      if (args.inspect) {
        log.info(
          `electron main process inspect document: https://www.electronjs.org/zh/docs/latest/tutorial/debugging-main-process`,
        );
      }
      if (FROM_TEST) {
        childProc.kill();
        process.exit(0);
      }
    });

    childProc.on('error', err => {
      log.error(err.message);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      childProc.kill();
      process.exit(1);
    });

    childProc.stdout?.pipe(process.stdout);

    this.electronProcess = childProc;
  }

  kill() {
    this.electronProcess?.kill();
  }
}

const manager = new ElectronProcessManager();

// 多窗口时的 Define 列表

const viewCompiler = Webpack(
  merge(rendererConfig, userConfig.renderer, {
    mode: 'development',
  }),
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const devServer = new WebpackDevServer(
  {
    port,
  },
  viewCompiler,
);

let fatherBuildWatcher: WatchReturnType;

devServer.startCallback(() => {
  log.success(`starting renderer server on http://localhost:${port}`);
  log.info(`running main process compiler...`);
  fatherBuildCli.watch({
    onBuild: () => {
      manager.start();
    },
  });
});

const exit = async () => {
  manager.kill();
  await devServer.stop();
  fatherBuildWatcher?.exit();
};

process.on('SIGINT', () => {
  // exit from terminal
  exit();
});

process.on('beforeExit', () => {
  exit();
});

process.on('uncaughtException', err => {
  console.log(err);
  exit().then(() => {
    process.exit(1);
  });
});
