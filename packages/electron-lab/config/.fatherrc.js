const { resolve } = require('path');

export default {
  entry: resolve(process.cwd(), 'src/main/index.ts'),
  cjs: {
    type: 'babel',
  },
  target: 'node',
  disableTypeCheck: true,
};
