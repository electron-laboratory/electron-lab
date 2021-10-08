import {
  exec,
  ExecOptions,
  ExecException,
  ChildProcess,
  execSync,
  ExecSyncOptions,
  ExecSyncOptionsWithStringEncoding,
  ExecSyncOptionsWithBufferEncoding,
} from 'child_process';
import { readFileSync } from 'fs';

function execWithPaths(
  command: string,
  callback?: (error: ExecException | null, stdout: string, stderr: string) => void,
): ChildProcess;
function execWithPaths(
  command: string,
  options: ExecOptions,
  callback?: (error: ExecException | null, stdout: string, stderr: string) => void,
): ChildProcess;
function execWithPaths(command: string, ...rest): ReturnType<typeof exec> {
  let [options, callback] = rest;

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (!options) {
    options = {};
  }

  const PATH =
    process.platform === 'darwin'
      ? readFileSync('/etc/paths', { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .map(path => path.trim())
          .join(':')
      : '';

  return exec(
    command,
    {
      ...options,
      env: {
        ...process.env,
        ...options.env,
        PATH: Array.from(
          new Set(
            [PATH, options.env?.PATH, process.env?.PATH]
              .filter(Boolean)
              .map(_ => _.trim())
              .join(':')
              .split(':'),
          ),
        ).join(':'),
      },
    },
    callback,
  );
}

function execWithPathsSync(command: string): Buffer;
function execWithPathsSync(command: string, options?: ExecSyncOptionsWithStringEncoding): string;
function execWithPathsSync(command: string, options?: ExecSyncOptionsWithBufferEncoding): Buffer;
function execWithPathsSync(command: string, options?: ExecSyncOptions): Buffer;
function execWithPathsSync(
  command: string,
  options: ExecSyncOptions = { env: {} },
): string | Buffer {
  const PATH =
    process.platform === 'darwin'
      ? readFileSync('/etc/paths', { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .map(path => path.trim())
          .join(':')
      : '';

  return execSync(command, {
    ...options,
    env: {
      ...process.env,
      ...options.env,
      PATH: Array.from(
        new Set(
          [PATH, options.env?.PATH, process.env?.PATH]
            .filter(Boolean)
            .map(_ => _.trim())
            .join(':')
            .split(':'),
        ),
      ).join(':'),
    },
  });
}

export { execWithPaths, execWithPathsSync };
