import { join } from 'path';
import { definedHandler } from '../../utils';
import { fork } from 'child_process';

const umiBinPath = join(require.resolve('umi'), '../bin/umi.js');

export default definedHandler({
  start: cb => {
    const proc = fork(umiBinPath, ['dev'], { cwd: process.cwd() });
    proc.stdout?.pipe(process.stdout);
    proc.on('exit', () => {
      process.exit();
    });
    cb();
  },
  build: cb => {
    // TODO: check umi outputPath
    const proc = fork(umiBinPath, ['build'], { cwd: process.cwd() });
    proc.stdout?.pipe(process.stdout);
    proc.on('exit', () => {
      cb();
    });
  },
  getEntry: mode => {
    if (mode === 'development') {
      return `module.exports = 'http://localhost:8000'`;
    } else {
      return `module.exports = \`file://\${require('path').resolve(__dirname,'./renderer/index.html')}\``;
    }
  },
});
