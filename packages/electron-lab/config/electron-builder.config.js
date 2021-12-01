/* eslint-disable @typescript-eslint/no-var-requires */
const { productName } = require('../package.json');

module.exports = {
  electronDownload: {
    mirror: 'https://npm.taobao.org/mirrors/electron/',
  },
  productName,
  files: ['.el/**'],
  mac: {
    category: 'public.app-category.developer-tools',
    target: 'dmg',
  },
  dmg: {},
  win: {
    target: 'nsis',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
};
