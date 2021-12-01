import { join, resolve } from 'path';
import { definedHandler } from '../../utils';
import { createUmiHandler } from '../umi';

const bigfishBinPath = join(
  resolve(process.cwd(), './node_modules', '@alipay/bigfish', 'bin', 'bigfish.js'),
);

export default definedHandler(createUmiHandler(bigfishBinPath));
