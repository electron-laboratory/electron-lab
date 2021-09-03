/* eslint-disable @typescript-eslint/no-var-requires */
import Webpack from 'webpack';
import { build, Platform, createTargets } from 'electron-builder';
import { merge } from 'webpack-merge';
import rimraf from 'rimraf';
import lodash from 'lodash';
import moment from 'moment';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';

const configPath = resolve(__dirname, '../../config');

const mainConfig = require(join(configPath, './main.webpack.config'));
const rendererConfig = require(join(configPath, './renderer.webpack.config'));
const builderConfig = require(join(configPath, './electron-builder.config'));

const customBuilderConfigPath = join(process.cwd(), './electron-builder.config');
let customBuilderConfig = {};
if (existsSync(customBuilderConfigPath)) {
  customBuilderConfig = merge({}, require(customBuilderConfigPath));
} else {
  console.log(chalk.red(`[electron-lab] no custom builder config was found.`));
}

const { productName } = require(join(process.cwd(), 'package.json'));

const isTestEnv = !!process.env.BUILD_TEST;

const testBuildNameExtra = isTestEnv ? `${moment().format('YYYY-MM-DD_HH-mm-ss')}` : '';

const webpackMode = isTestEnv ? 'development' : 'production';
// 清空目录

rimraf.sync(join(process.cwd(), 'dist'));
rimraf.sync(join(process.cwd(), '.webpack'));

// 先构建 webpack 产物

const buildApp = new Promise<void>((resolve) => {
  const appCompiler = Webpack(
    merge(mainConfig, {
      mode: webpackMode,
      plugins: [
        new Webpack.DefinePlugin({
          WEBPACK_ENTRY: `\`file://\${require('path').resolve(__dirname, '../renderer/index.html')}\``,
        }),
      ],
    })
  );
  appCompiler.run(() => {
    console.log(chalk.green('[electron-lab] done main build.'));
    resolve();
  });
});

const buildRenderer = new Promise<void>((resolve) => {
  const viewCompiler = Webpack(
    merge(rendererConfig, {
      mode: webpackMode,
    })
  );
  viewCompiler.run(() => {
    console.log(chalk.green('[electron-lab] done renderer build.'));
    resolve();
  });
});

const buildElectron = () => {
  // 构建 mac 系统包

  const targets =
    process.platform === 'darwin' ? [Platform.MAC, Platform.WINDOWS] : [Platform.WINDOWS];

  build({
    targets: createTargets(targets),
    config: lodash.merge(
      customBuilderConfig,
      builderConfig,
      {
        electronVersion: '14.0.0',
      },
      isTestEnv
        ? {
            productName: `${productName}-test`,
            dmg: {
              title: `\${productName}-\${version}-${testBuildNameExtra}`,
              artifactName: `\${productName}-\${version}-${testBuildNameExtra}.\${ext}`,
            },
            nsis: {
              artifactName: `\${productName}-setup-\${version}-${testBuildNameExtra}.\${ext}`,
            },
          }
        : {
            dmg: {
              title: `\${productName}-\${version}`,
              artifactName: `\${productName}-\${version}.\${ext}`,
            },
            nsis: {
              artifactName: `\${productName}-setup-\${version}.\${ext}`,
            },
          }
    ),
  })
    .then((res) => {
      console.log(res);
      process.exit();
    })
    .catch((err) => {
      console.log(err);
    });
};

Promise.all([buildApp, buildRenderer]).then(() => {
  buildElectron();
});
