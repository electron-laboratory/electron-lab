import { exec, ExecOptions, ExecException, ChildProcess } from 'child_process';
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

export default execWithPaths;
