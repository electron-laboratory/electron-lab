const { productName } = require('../package.json');
const { resolve } = require('path');

module.exports = {
  electronDownload: {
    mirror: 'https://npm.taobao.org/mirrors/electron/',
  },
  productName,
  files: ['.webpack/**/*'],
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
