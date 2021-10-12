/* eslint-disable @typescript-eslint/no-var-requires */
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import proc, { ChildProcess } from 'child_process';
import electron from 'electron';
import { resolve, join } from 'path';
import { merge } from 'webpack-merge';
import { buildVersion, getWindows, log } from '../utils';
import { getUserConfig } from '../config';

const FROM_TEST = !!process.env.FROM_TEST;

const configPath = resolve(__dirname, '../../config');
const mainConfig = require(join(configPath, './main.webpack.config'));
const rendererConfig = require(join(configPath, './renderer.webpack.config'));
const userConfig = getUserConfig();

const { port } = rendererConfig.devServer;
const appPath = resolve(process.cwd());

buildVersion();

class ElectronProcessManager {
  electronProcess: ChildProcess | undefined;
  start() {
    this.kill();
    const childProc = proc.spawn((electron as unknown) as string, [appPath], {
      stdio: 'pipe',
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    childProc.on('spawn', () => {
      log.success('Spawn electron success.');
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

const appCompiler = Webpack(
  merge(mainConfig, userConfig.main, {
    mode: 'development',
    plugins: [
      new Webpack.DefinePlugin({
        _IS_DEV: JSON.stringify(true),
        _PORT: JSON.stringify(port),
        _FOUND_ENTRIES: JSON.stringify(getWindows()),
        _getEntry: (port: number, entryName?: string) => {
          return entryName
            ? `http://localhost:${port}/${entryName}.html`
            : `http://localhost:${port}/index.html`;
        },
      }),
    ],
  }),
);
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

devServer.startCallback(() => {
  log.success(`Starting renderer server on http://localhost:${port}`);
  appCompiler.watch(
    {
      aggregateTimeout: 300,
    },
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      if (result?.hasErrors()) {
        console.log(result.compilation.errors);
        return;
      }
      manager.start();
    },
  );
});

const exit = async () => {
  manager.kill();
  await devServer.stop();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  appCompiler.close(() => {});
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
