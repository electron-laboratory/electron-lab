/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getWindows } = require('../../utils');

const PORT = process.env.PORT;

const windows = getWindows();

const entry = windows.reduce(
  (prev, current) => {
    return { ...prev, [current]: resolve(process.cwd(), `src/renderer/windows/${current}`) };
  },
  {
    index: resolve(process.cwd(), 'src/renderer/index.tsx'),
  },
);

const htmlWebpackPlugins = Object.keys(entry).map(entryName => {
  return new HtmlWebpackPlugin({
    filename: `${entryName}.html`,
    template: resolve(process.cwd(), 'src/renderer/public/index.html'),
    chunks: [entryName],
  });
});

module.exports = {
  entry: entry,
  output: {
    path: resolve(process.cwd(), '.el/renderer'),
  },
  devServer: {
    port: PORT || 3901,
  },
  devtool: 'source-map',
  infrastructureLogging: {
    level: 'error',
  },
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          {
            loader: require.resolve('less-loader'),
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-react'),
              require.resolve('@babel/preset-typescript'),
            ],
            plugins: [
              [
                require.resolve('babel-plugin-import'),
                {
                  libraryName: 'antd',
                  libraryDirectory: 'es',
                  style: true,
                },
              ],
              [
                require.resolve('babel-plugin-import-to-window-require'),
                {
                  packages: ['electron'],
                },
              ],
            ],
          },
        },
      },
      {
        test: /(\.svg)|(\.png)$/,
        use: [
          {
            loader: require.resolve('url-loader'),
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json', '.less'],
    alias: {
      react: require.resolve('react'),
    },
  },
  plugins: [
    ...htmlWebpackPlugins,
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    //   chunkFilename: '[id].css',
    // }),
  ],
};
