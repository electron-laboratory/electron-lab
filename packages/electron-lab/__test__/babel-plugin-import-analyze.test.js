const { transform } = require('@babel/core');
const plugin = require('../src/features/package-analyze/babel-plugin-import-analyze');

describe('import analyze plugin test', () => {
  it('default usage', () => {
    const result = [];
    transform('import A from "electron";await import("fs");require("child_process")', {
      filename: 'test.js',
      plugins: [
        [
          plugin,
          {
            onCollect: (filename, dep) => {
              result.push(dep);
            },
          },
        ],
      ],
    });
    expect(result).toEqual(['electron', 'fs', 'child_process']);
  });
});
