const { transform } = require('@babel/core');
const plugin = require('../lib/index');

describe('Plug-ins compile normally.', () => {
  test('import', () => {
    expect(
      transform(`import { ipcRenderer } from 'electron';import 'index.less';foo;`, {
        filename: 'file.js',
        plugins: [[require.resolve('../lib/index.js'), { packages: 'electron' }]],
      }).code,
    ).toEqual(
      `
const {
  ipcRenderer: ipcRenderer
} = window.require("electron");

import 'index.less';
foo;
    `.trim(),
    );
  });

  test('import with default', () => {
    expect(
      transform(
        `import { ipcRenderer } from 'electron';
         import electron from 'electron';
         import React from 'react';
         electron;`,
        {
          filename: 'file.js',
          plugins: [[require.resolve('../lib/index.js'), { packages: 'electron' }]],
        },
      ).code,
    ).toEqual(
      `
const {
  ipcRenderer: ipcRenderer
} = window.require("electron");

const electron = window.require("electron");

import React from 'react';
electron;
    `.trim(),
    );
  });
});
