/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';

export const getUserConfig = (): {
  renderer: Record<string, unknown>;
} => {
  let rendererConfig = {};
  const rendererConfigPath = path.resolve(process.cwd(), 'webpack.config.js');
  if (fs.existsSync(rendererConfigPath)) {
    rendererConfig = require(rendererConfigPath);
  }
  return {
    renderer: rendererConfig,
  };
};
