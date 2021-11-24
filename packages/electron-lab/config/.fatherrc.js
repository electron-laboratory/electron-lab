const { resolve } = require('path');
const { writeFileSync } = require('fs');

const deps = new Set(); // 搜集所有依赖
const depsOfFile = {}; // 搜集文件依赖
const filesOfDep = {}; // 搜集依赖所在文件
/**
 *
 * @param {Set} toGenerateDeps
 */
const generateDeps = toGenerateDeps => {
  writeFileSync(
    resolve(process.cwd(), '.el/dependencies.json'),
    JSON.stringify({
      all: Array.from(toGenerateDeps),
      files: Object.keys(depsOfFile).reduce((memo, current) => {
        return {
          ...memo,
          [current]: Array.from(depsOfFile[current]),
        };
      }, {}),
      deps: Object.keys(filesOfDep).reduce((memo, current) => {
        return {
          ...memo,
          [current]: Array.from(filesOfDep[current]),
        };
      }, {}),
    }),
  );
};

export default {
  entry: resolve(process.cwd(), 'src/main/index.ts'),
  cjs: {
    type: 'babel',
  },
  target: 'node',
  disableTypeCheck: true,
  extraBabelPlugins: [
    [
      require('../lib/features/package-analyze/babel-plugin-import-analyze'),
      {
        onCollect: (filename, depName) => {
          // 项目内部依赖忽略，@依赖抓取前两个
          let finalDepName = depName;
          if (depName.startsWith('.')) {
            // exp: ../node_modules/foo/utils
            if (!depName.includes('node_modules')) {
              return;
            }
            finalDepName = depName.slice(
              depName.indexOf('node_modules') + 'node_modules'.length + 1,
            );
          }

          if (finalDepName.startsWith('@')) {
            finalDepName = finalDepName
              .split('/')
              .slice(0, 2)
              .join('/');
          }

          deps.add(finalDepName);
          if (!depsOfFile[filename]) {
            depsOfFile[filename] = new Set();
          }
          if (!filesOfDep[finalDepName]) {
            filesOfDep[finalDepName] = new Set();
          }
          filesOfDep[finalDepName].add(filename);
          depsOfFile[filename].add(finalDepName);
          generateDeps(deps);
        },
      },
    ],
  ],
};
