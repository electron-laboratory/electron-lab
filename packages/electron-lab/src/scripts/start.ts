/* eslint-disable no-console */
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import proc, { ChildProcess } from 'child_process';
import electron from 'electron';
import { resolve, join } from 'path';
import { merge } from 'webpack-merge';
import readline, { Interface } from 'readline';
import chalk from 'chalk';

const configPath = resolve(__dirname, '../../config');
const mainConfig = require(join(configPath, './main.webpack.config'));
const rendererConfig = require(join(configPath, './renderer.webpack.config'));

const { port } = rendererConfig.devServer;
const appPath = resolve(process.cwd());

class ElectronProcessManager {
  electronProcess: ChildProcess | undefined;
  rlInterface: Interface | undefined;
  start() {
    this.electronProcess?.kill();
    this.rlInterface?.close();
    this.electronProcess = proc.spawn((electron as unknown) as string, [appPath]);
    this.rlInterface = readline
      .createInterface({
        input: this.electronProcess.stdout!,
        terminal: false,
      })
      .on('line', (line) => {
        console.log(chalk.cyan(`>> `), line);
      });
    this.electronProcess.on('error', (err) => {
      console.log(err);
    });
  }

  kill() {
    this.electronProcess?.kill();
    this.rlInterface?.close();
  }
}

const manager = new ElectronProcessManager();

const appCompiler = Webpack(
  merge(mainConfig, {
    mode: 'development',
    plugins: [
      new Webpack.DefinePlugin({
        WEBPACK_ENTRY: `"http://localhost:${port}"`,
      }),
    ],
  })
);
const viewCompiler = Webpack(
  merge(rendererConfig, {
    mode: 'development',
  })
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
  }
);

// @ts-ignore
const devServer = new WebpackDevServer(
  {
    port,
  },
  viewCompiler
);

devServer.listen(port, '127.0.0.1', () => {
  console.log(`Starting server on http://localhost:${port}`);
});

process.on('exit', () => {
  manager.kill();
});
