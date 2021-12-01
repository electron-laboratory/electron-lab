/* eslint-disable @typescript-eslint/no-var-requires */
import { build, Platform, createTargets } from 'electron-builder';
import { merge } from 'webpack-merge';
import rimraf from 'rimraf';
import lodash from 'lodash';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { buildVersion, log, generateEntryFile, generateMd5 } from '../utils';
import yParser from 'yargs-parser';
import { FatherBuildCli } from '../fatherCli';
import { packageAnalyze } from '../features/package-analyze';

const args = yParser(process.argv.slice(2));
let { output } = args;
if (!output) {
  output = './dist';
}
log.info(`output dir: ${output}`);

const configPath = resolve(__dirname, '../../config');
const builderConfig = require(join(configPath, './electron-builder.config'));

const fatherBuildCli = new FatherBuildCli({});

const customBuilderConfigPath = join(process.cwd(), './electron-builder.config.js');
let customBuilderConfig = {};
if (existsSync(customBuilderConfigPath)) {
  customBuilderConfig = merge({}, require(customBuilderConfigPath));
} else {
  log.warn('no custom builder config was found.');
}

const engineName = args.engine || 'default';
const engine = require(join(__dirname, '../engines', engineName)).default;

if (!engine) {
  throw new Error(log.error(`cannot found engine \`${engineName}\`!`));
}

// 清空目录
rimraf.sync(join(process.cwd(), 'dist'));
rimraf.sync(join(process.cwd(), '.el'));

// 构建入口
generateEntryFile(engine.getEntry('production'));

// 先构建 webpack 产物

const buildApp = () =>
  new Promise<void>(resolve => {
    fatherBuildCli.build().then(() => {
      resolve();
    });
  });

const buildRenderer = () =>
  new Promise<void>(resolve => {
    engine.build(() => {
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
      {
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
    .then(res => {
      generateMd5(res);
      log.success(`build ${chalk.greenBright('application')} successfully.`);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      process.send?.('exit');
    });
};

Promise.all([buildApp(), buildRenderer()]).then(() => {
  buildVersion();
  packageAnalyze();
  log.info(`starting build application`);
  buildElectron();
});

process.on('uncaughtException', () => process.exit(1));
process.on('unhandledRejection', () => process.exit(1));
