const Webpack = require('webpack');
const mainConfig = require('../config/main.webpack.config');
const rendererConfig = require('../config/renderer.webpack.config');

describe('The WebPack configuration should work fine', () => {
  it('main', () => {
    expect(() => {
      try {
        const complier = Webpack(mainConfig);
      } catch (error) {
        throw error;
      }
    }).not.toThrowError();
  });

  it('renderer', () => {
    expect(() => {
      try {
        const complier = Webpack(rendererConfig);
      } catch (error) {
        throw error;
      }
    }).not.toThrowError();
  });
});
