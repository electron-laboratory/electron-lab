import { join } from 'path';
import chalk from 'chalk';
import { existsSync, readFileSync, appendFileSync, writeFileSync } from 'fs';
import { log } from './utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const userPackageJson = require(join(process.cwd(), 'package.json'));
const { main } = userPackageJson;
if (!main || main !== '.el/main/index.js') {
  throw chalk.bgRedBright('Error') +
    ` ${chalk.red('main')} field in package.json must be ${chalk.red('".el/main/index.js"')}`;
}

const npmRcPath = join(process.cwd(), '.npmrc');
if (existsSync(npmRcPath)) {
  const userNpmRc = readFileSync(npmRcPath, { encoding: 'utf-8' });
  if (!/electron-mirror/.test(userNpmRc)) {
    appendFileSync(npmRcPath, '\nelectron-mirror=https://npm.taobao.org/mirrors/electron/');
    log.success('Appended electron-mirror. to .npmrc automatically');
  }
  if (!/electron-builder-binaries-mirror/.test(userNpmRc)) {
    appendFileSync(
      npmRcPath,
      '\nelectron-builder-binaries-mirror=http://npm.taobao.org/mirrors/electron-builder-binaries/',
    );
    log.success('Appended electron-builder-binaries-mirror. to .npmrc automatically');
  }
} else {
  writeFileSync(
    npmRcPath,
    `
electron-mirror=https://npm.taobao.org/mirrors/electron/
electron-builder-binaries-mirror=http://npm.taobao.org/mirrors/electron-builder-binaries/
  `.trim(),
  );
  log.success(
    'Appended electron-builder-binaries-mirror & electron-mirror to .npmrc automatically',
  );
}
