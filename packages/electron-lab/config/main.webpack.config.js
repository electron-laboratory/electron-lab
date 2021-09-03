/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

module.exports = {
  entry: resolve(process.cwd(), 'src/main/index.ts'),
  output: {
    path: resolve(process.cwd(), '.webpack/main'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  devtool: 'source-map',
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('@babel/preset-typescript')],
          },
        },
      },
    ],
  },
};
