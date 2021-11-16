/* eslint-disable @typescript-eslint/no-var-requires */
import Webpack from 'webpack';
import { build, Platform, createTargets } from 'electron-builder';
import { merge } from 'webpack-merge';
import rimraf from 'rimraf';
import lodash, { reject } from 'lodash';
import moment from 'moment';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { buildVersion, getWindows, log } from '../utils';
import { getUserConfig } from '../config';
import yParser from 'yargs-parser';

const args = yParser(process.argv.slice(2));
let { output } = args;
if (!output) {
  output = './dist';
}
log.info(`output dir: ${output}`);

const configPath = resolve(__dirname, '../../config');

const mainConfig = require(join(configPath, './main.webpack.config'));
const rendererConfig = require(join(configPath, './renderer.webpack.config'));
const builderConfig = require(join(configPath, './electron-builder.config'));
const userConfig = getUserConfig();

const customBuilderConfigPath = join(process.cwd(), './electron-builder.config.js');
let customBuilderConfig = {};
if (existsSync(customBuilderConfigPath)) {
  customBuilderConfig = merge({}, require(customBuilderConfigPath));
} else {
  log.warn('no custom builder config was found.');
}

const { productName } = require(join(process.cwd(), 'package.json'));

const isTestEnv = !!process.env.BUILD_TEST;

const testBuildNameExtra = isTestEnv ? `${moment().format('YYYY-MM-DD_HH-mm-ss')}` : '';

const webpackMode = isTestEnv ? 'development' : 'production';
// 清空目录

rimraf.sync(join(process.cwd(), 'dist'));
rimraf.sync(join(process.cwd(), '.webpack'));

// 先构建 webpack 产物

const buildApp = new Promise<void>((resolve, reject) => {
  const appCompiler = Webpack(
    merge(mainConfig, userConfig.main, {
      mode: webpackMode,
      plugins: [
        new Webpack.DefinePlugin({
          _IS_DEV: JSON.stringify(false),
          _PORT: JSON.stringify(undefined),
          _FOUND_ENTRIES: JSON.stringify(getWindows()),
          _getEntry: (entryName?: string) => {
            const finalEntry = entryName || 'index';
            return `file://${require('path').resolve(
              __dirname,
              '../renderer/' + finalEntry + '.html',
            )}`;
          },
        }),
      ],
    }),
  );
  appCompiler.run((err, res) => {
    if (err) {
      throw err;
    }
    if (res?.hasErrors()) {
      res.compilation.errors.forEach(error => {
        log.error(error.stack || error.message);
      });
      reject('build main fail.');
    }
    log.success(`build ${chalk.greenBright('main')} successfully.`);
    resolve();
  });
});

const buildRenderer = new Promise<void>(resolve => {
  const viewCompiler = Webpack(
    merge(rendererConfig, userConfig.renderer, {
      mode: webpackMode,
    }),
  );
  viewCompiler.run((err, res) => {
    if (err) {
      throw err;
    }
    if (res?.hasErrors()) {
      res.compilation.errors.forEach(error => {
        log.error(error.stack || error.message);
      });
      reject('build renderer fail.');
    }
    log.success(`build ${chalk.greenBright('renderer')} successfully.`);
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
        directories: { output },
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
          },
    ),
  })
    .then(() => {
      log.success(`build ${chalk.greenBright('application')} successfully.`);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      process.send?.('exit');
    });
};

Promise.all([buildApp, buildRenderer])
  .then(() => {
    buildVersion();
    log.info(`starting build application`);
    buildElectron();
  })
  .catch(reason => {
    log.error(reason);
  });

process.on('uncaughtException', () => {
  process.exit(1);
});
