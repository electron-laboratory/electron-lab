# electron-lab

electron-lab 致力于探索 electron 研发的最佳实践，让开发者可以快速启动以及开发一个 electron 应用。

## 特性

- 🎉 一键启停，一键构建
- 🎉 支持 typescript
- 🎉 自定义标题栏的封装 [@electron-lab/title-bar](https://github.com/electron-laboratory/electron-lab/tree/main/packages/title-bar)
- 🎉 内置 electron-builder

## 使用

### 1. 安装依赖

```shell
$ npm i electron-lab --save-dev
```

添加脚本到你的 package.json 里：

```json
{
  "script": {
    "start": "el start",
    "build": "el build"
  }
}
```

### 2. 初始化项目目录

约定 `src/main/index.ts` 作为主进程入口，`src/renderer/index.tsx` 作为渲染进程入口。

```
electron-lab-example
├── package.json
└── src
    ├── main
    │   └── index.ts
    └── renderer
        ├── index.less
        ├── index.tsx
        └── public
            └── index.html
```

在 `src/main/index.ts` 中，通过 webpack DefinePlugin 注入了应用入口：`WEBPACK_ENTRY`。

```ts
// 以下代码添加到 src/main/index.ts 中
declare const WEBPACK_ENTRY: string;

mainWindow.loadURL(WEBPACK_ENTRY);
```

最后：

```shell
yarn start 或者 npm start
```

## 构建应用

```shell
$ yarn build
```

结果将会出现在 `dist` 目录中。
