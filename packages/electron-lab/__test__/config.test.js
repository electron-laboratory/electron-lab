const { spawnSync } = require('child_process');
const Webpack = require('webpack');
const { join } = require('path');
const rendererConfig = require('../lib/engines/default/webpack.config');

describe('The WebPack configuration should work fine.', () => {
  it('renderer', () => {
    expect(() => {
      try {
        const complier = Webpack(rendererConfig);
      } catch (error) {
        throw error;
      }
    }).not.toThrowError();
  });

  it('main', () => {
    const { error } = spawnSync(
      'father-build',
      [`--config=${join(__dirname, '../config/.fatherrc.js')}`, `--src="./main"`],
      {
        cwd: join(__dirname, './fixtures'),
        encoding: 'utf-8',
      },
    );
    expect(error).toBe(undefined);
  });
});
