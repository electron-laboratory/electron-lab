import { join } from 'path';
import chalk from 'chalk';
import { existsSync, readFileSync, appendFileSync, writeFileSync } from 'fs';

const userPackageJson = require(join(process.cwd(), 'package.json'));
const { main } = userPackageJson;
if (!main || main !== '.webpack/main/index.js') {
  throw chalk.red(
    '\n[electron-lab] main field in package.json should be ".webpack/main/index.js"\n'
  );
}

const npmRcPath = join(process.cwd(), '.npmrc');
if (existsSync(npmRcPath)) {
  const userNpmRc = readFileSync(npmRcPath, { encoding: 'utf-8' });
  if (!/electron-mirror/.test(userNpmRc)) {
    appendFileSync(npmRcPath, '\nelectron-mirror=https://npm.taobao.org/mirrors/electron/');
    console.log(chalk.green('[electron-lab] auto append electron-mirror. to .npmrc'));
  }
  if (!/electron-builder-binaries-mirror/.test(userNpmRc)) {
    appendFileSync(
      npmRcPath,
      '\nelectron-builder-binaries-mirror=http://npm.taobao.org/mirrors/electron-builder-binaries/'
    );
    console.log(
      chalk.green('[electron-lab] auto append electron-builder-binaries-mirror. to .npmrc')
    );
  }
} else {
  writeFileSync(
    npmRcPath,
    `
electron-mirror=https://npm.taobao.org/mirrors/electron/
electron-builder-binaries-mirror=http://npm.taobao.org/mirrors/electron-builder-binaries/
  `.trim()
  );
  console.log(
    chalk.green(
      '[electron-lab] auto append electron-builder-binaries-mirror & electron-mirror to .npmrc.'
    )
  );
}
