const { fork } = require('child_process');
const { readdirSync, existsSync, writeFileSync, mkdirSync } = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');

describe('The script should execute normally.', () => {
  rimraf.sync(join(__dirname, './fixtures/.el'));

  jest.setTimeout(10000);
  /** 为了避免测试报错，写入一个假包 */
  const TEST_PACKAGE_DIR = join(__dirname, './fixtures', './node_modules', 'some-package');
  mkdirSync(TEST_PACKAGE_DIR, { recursive: true });
  writeFileSync(join(TEST_PACKAGE_DIR, 'index.js'), '');
  writeFileSync(join(TEST_PACKAGE_DIR, 'package.json'), JSON.stringify({ main: './index.js' }));

  it('Start script', (done) => {
    const proc = fork(resolve(__dirname, '../lib/scripts/start.js'), {
      cwd: join(__dirname, './fixtures'),
      env: { ...process.env, FROM_TEST: 1 },
    });
    proc.on('exit', (code) => {
      expect(code).toEqual(0);
      done();
    });
  });

  it('The file structure of the main process should be preserved in start script.', () => {
    expect(existsSync(join(__dirname, './fixtures/.el/main/foo/bar/index.js'))).toBeTruthy();
  });

  it('`entry.js`, `version.json` should build by start script.', () => {
    const dir = readdirSync(join(__dirname, './fixtures/.el'));
    expect(dir.includes('entry.js')).toBeTruthy();
    expect(dir.includes('version.json')).toBeTruthy();
  });

  jest.setTimeout(60000);
  rimraf.sync(join(__dirname, './fixtures/.el'));

  it('Build script should fail while lose dependencies.', (done) => {
    const proc = fork(resolve(__dirname, '../lib/scripts/build.js'), {
      cwd: join(__dirname, './fixtures'),
      env: { ...process.env, FROM_TEST: 1 },
    });
    proc.on('exit', (code) => {
      expect(code).toEqual(1);
      done();
    });
  });

  it('`entry.js`, `version.json`, `dependencies.json` should build by build script.', () => {
    const dir = readdirSync(join(__dirname, './fixtures/.el'));
    expect(dir.includes('entry.js')).toBeTruthy();
    expect(dir.includes('version.json')).toBeTruthy();
    expect(dir.includes('dependencies.json')).toBeTruthy();
  });

  it('The file structure of the main process should be preserved in build script.', () => {
    expect(existsSync(join(__dirname, './fixtures/.el/main/foo/bar/index.js'))).toBeTruthy();
  });
});
