import { spawn } from 'child_process';
import { existsSync, readFileSync, rename, renameSync, rmdir } from 'fs';
import path, { isAbsolute, join } from 'path';
import chokidar from 'chokidar';
import { debounce } from 'lodash';

type FatherBuildCliOpts = {
  configPath?: string;
};

export type WatchReturnType = {
  exit: () => void;
};

type WatchOpts = {
  onBuild?: () => void;
};

type BuildOpts = {
  cwd?: string;
};

class FatherBuildCli {
  private opts: FatherBuildCliOpts;
  constructor(opts: FatherBuildCliOpts) {
    this.opts = opts;
  }
  watch(opts: WatchOpts): { exit: () => void } {
    const proc = spawn(
      'father-build',
      [`--src=./src/main`, `--output=.el/main`, '-w', `--config=${this.opts.configPath}`],
      {
        stdio: 'pipe',
        env: { ...process.env, FORCE_COLOR: '1' },
      },
    );
    proc.stdout.pipe(process.stdout);
    const watcher = chokidar.watch(join(process.cwd(), '.el/main'), { ignoreInitial: true }).on(
      'all',
      debounce(() => {
        opts.onBuild?.();
      }, 500),
    );
    return {
      exit: () => {
        watcher.close().then(() => {
          proc.kill();
        });
      },
    };
  }
  build(opts?: BuildOpts): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const args = this.opts.configPath ? [`--config=${this.opts.configPath}`] : [];
      const proc = spawn('father-build', args.concat([`--ignores=src/renderer`, `--output=.el`]), {
        stdio: 'pipe',
        env: { ...process.env, FORCE_COLOR: '1' },
        cwd: opts?.cwd,
      });
      proc.stdout.pipe(process.stdout);
      const messages: unknown[] = [];
      proc.on('message', msg => {
        messages.push(msg);
      });
      proc.on('close', code => {
        if (code !== 0) {
          reject(messages.join('\n'));
        }
        resolve(true);
      });
      proc.on('error', err => {
        throw err;
      });
    });
  }
  static getUserConfig(): string | undefined {
    const userConfigPath = path.resolve(process.cwd(), '.fatherrc.js');
    if (existsSync(userConfigPath)) {
      return readFileSync(userConfigPath, 'utf-8');
    }
    return;
  }
}

export { FatherBuildCli };
