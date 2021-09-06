/* eslint-disable @typescript-eslint/no-var-requires */
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import proc, { ChildProcess } from 'child_process';
import electron from 'electron';
import { resolve, join } from 'path';
import { merge } from 'webpack-merge';
import { getWindows, log } from '../utils';

const configPath = resolve(__dirname, '../../config');
const mainConfig = require(join(configPath, './main.webpack.config'));
const rendererConfig = require(join(configPath, './renderer.webpack.config'));

const { port } = rendererConfig.devServer;
const appPath = resolve(process.cwd());

class ElectronProcessManager {
  electronProcess: ChildProcess | undefined;
  start() {
    this.electronProcess?.kill();
    this.electronProcess = proc.spawn((electron as unknown) as string, [appPath], {
      stdio: 'pipe',
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    this.electronProcess.stdout?.pipe(process.stdout);
  }

  kill() {
    this.electronProcess?.kill();
  }
}

const manager = new ElectronProcessManager();

// 多窗口时的 Define 列表

const appCompiler = Webpack(
  merge(mainConfig, {
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
  merge(rendererConfig, {
    mode: 'development',
  }),
);

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const devServer = new WebpackDevServer(
  {
    port,
  },
  viewCompiler,
);

devServer.listen(port, '127.0.0.1', () => {
  log.success(`Starting renderer server on http://localhost:${port}`);
});

process.on('exit', () => {
  manager.kill();
});
