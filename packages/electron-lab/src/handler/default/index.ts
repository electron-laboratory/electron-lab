import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import { getUserConfig } from './config';
import { definedHandler, getWindows } from '../../utils';
import { HandlerType } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rendererConfig = require('./webpack.config');
const userConfig = getUserConfig();
const finalConfig = merge(rendererConfig, userConfig.renderer, {
  mode: 'development',
});
const { port } = finalConfig.devServer;
const viewCompiler = Webpack(finalConfig);
const devServer = new WebpackDevServer(finalConfig.devServer, viewCompiler as any);

const handler: HandlerType = {
  start: cb => {
    devServer.startCallback(() => {
      cb();
    });
  },
  build: cb => {
    const viewCompiler = Webpack(
      merge(rendererConfig, userConfig.renderer, {
        mode: 'production',
      }),
    );
    viewCompiler.run(() => {
      cb();
    });
  },
  getEntry: mode => {
    const windows = getWindows().concat(['index']);
    if (mode === 'development') {
      const createEntryString = (name: string) => {
        return `"${name}":"http://127.0.0.1:${port}/${name}.html"`;
      };
      return `
              module.exports = {
                ${windows.map(windowName => createEntryString(windowName)).join(',\n')}
              }
            `;
    } else {
      const createEntryString = (name: string) => {
        return `"${name}":\`file://\${require('path').resolve(__dirname,'./renderer/${name}.html')}\``;
      };
      return `
              module.exports = {
                ${windows.map(windowName => createEntryString(windowName)).join(',\n')}
              }
            `;
    }
  },
};

export default definedHandler(handler);
