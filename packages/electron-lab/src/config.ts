/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';

export const getUserConfig = (): {
  main: Record<string, unknown>;
  renderer: Record<string, unknown>;
} => {
  let mainConfig = {};
  const mainConfigPath = path.resolve(process.cwd(), 'main.webpack.config.js');
  if (fs.existsSync(mainConfigPath)) {
    mainConfig = require(mainConfigPath);
  }

  let rendererConfig = {};
  const rendererConfigPath = path.resolve(process.cwd(), 'main.webpack.config.js');
  if (fs.existsSync(rendererConfigPath)) {
    rendererConfig = require(rendererConfigPath);
  }
  return {
    main: mainConfig,
    renderer: rendererConfig,
  };
};
