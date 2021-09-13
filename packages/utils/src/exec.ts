import { exec, ExecOptions, ExecException, ChildProcess } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

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

  if (process.platform !== 'darwin') {
    console.log(`warning: execWithPaths works in MacOS only. The original exec is being used.`);
    return exec(command, options, callback);
  }

  const cmd = command.split(' ')[0];

  const paths = readFileSync('/etc/paths', { encoding: 'utf-8' });
  const bin = paths
    .trim()
    .split('\n')
    .map(p => join(p.trim(), cmd))
    .filter(binPath => existsSync(binPath))[0];

  if (bin) {
    return exec([bin].concat(command.split(' ').slice(1)).join(' '), options, callback);
  } else {
    throw new Error(`Command ${cmd} notFound`);
  }
}

export default execWithPaths;
