const { execWithPaths } = require('../lib/index');

describe('exec with paths', () => {
  test('env should be injected in MacOS', done => {
    if (process.platform === 'darwin') {
      execWithPaths(
        'echo $TEST_INJECT',
        {
          env: {
            TEST_INJECT: '1',
          },
        },
        (err, stdout) => {
          expect(stdout.trim()).toEqual('1');
          done();
        },
      );
    } else {
      done();
    }
  });
  test('env should include /etc/paths', done => {
    if (process.platform === 'darwin') {
      execWithPaths(
        'echo $PATH',
        {
          env: {
            PATH: '/somewhere/bin:/there/bin',
          },
        },
        (err, stdout, stderr) => {
          const out = stdout.trim();
          expect(/\/usr\/local\/bin/.test(out)).toBeTruthy();
          expect(/\/somewhere\/bin/.test(out)).toBeTruthy();
          expect(/\/there\/bin/.test(out)).toBeTruthy();
          done();
        },
      );
    } else {
      done();
    }
  });
});
