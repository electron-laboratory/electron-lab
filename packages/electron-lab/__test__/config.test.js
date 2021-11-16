const Webpack = require('webpack');
const rendererConfig = require('../config/webpack.config');

describe('The WebPack configuration should work fine', () => {
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
