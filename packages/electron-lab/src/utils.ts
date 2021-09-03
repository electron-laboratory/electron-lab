import chalk from 'chalk';
import fs from 'fs';
import { join } from 'path';

export const getWindows = (dir?: string): string[] => {
  const finalDir = dir || join(process.cwd(), 'src/renderer/windows');
  if (fs.existsSync(finalDir)) {
    const dir = fs.readdirSync(finalDir);
    if (dir.includes('index')) {
      throw chalk.red('[electron lab] Don\'t use "index" as window name.');
    }
    return dir;
  }
  return [];
};
