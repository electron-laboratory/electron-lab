import { join } from 'path';
import { definedHandler } from '../../utils';
import { fork } from 'child_process';
import { HandlerType } from '../../types';

const umiBinPath = join(join(process.cwd(), 'node_modules'), 'umi', 'bin', 'umi.js');

export const createUmiHandler = (binPath: string): HandlerType => {
  return {
    start: (cb) => {
      const proc = fork(binPath, ['dev'], { cwd: process.cwd() });
      proc.stdout?.pipe(process.stdout);
      proc.on('exit', () => {
        process.exit();
      });
      cb();
    },
    build: (cb) => {
      // TODO: check umi outputPath
      const proc = fork(binPath, ['build'], { cwd: process.cwd() });
      proc.stdout?.pipe(process.stdout);
      proc.on('exit', () => {
        cb();
      });
    },
    getEntry: (mode) => {
      if (mode === 'development') {
        return `module.exports = 'http://localhost:${process.env.PORT || '8000'}'`;
      } else {
        return `module.exports = \`file://\${require('path').resolve(__dirname,'./renderer/index.html')}\``;
      }
    },
  };
};

export default definedHandler(createUmiHandler(umiBinPath));
