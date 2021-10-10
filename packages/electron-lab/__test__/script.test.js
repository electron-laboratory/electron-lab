const { fork } = require('child_process');
const { join, resolve } = require('path');

describe('The script should execute normally', () => {
  jest.setTimeout(5000);
  it('Start script', done => {
    const proc = fork(resolve(__dirname, '../lib/scripts/start.js'), {
      cwd: join(__dirname, './fixtures'),
      env: { ...process.env, FROM_TEST: 1 },
    });
    proc.on('exit', code => {
      expect(code).toEqual(0);
      done();
    });
  });
  jest.setTimeout(60000);
  // i dont like this...
  xit('Build script', done => {
    const proc = fork(resolve(__dirname, '../lib/scripts/build.js'), {
      cwd: join(__dirname, './fixtures'),
      env: { ...process.env, FROM_TEST: 1 },
    });
    proc.on('exit', code => {
      expect(code).toEqual(0);
      done();
    });
  });
});
