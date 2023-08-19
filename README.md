> 已废弃，请移步到 https://github.com/xiefengnian/umijs-electron-plugin

# electron-lab

electron-lab 致力于探索 electron 研发的最佳实践，让开发者可以快速启动以及开发一个 electron 应用。

## 特性

- 🎉 非常好用项目脚手架 [electron-lab](https://github.com/electron-laboratory/electron-lab/tree/main/packages/electron-lab)
- 🎉 非常好用的标题栏封装 [@electron-lab/title-bar](https://github.com/electron-laboratory/electron-lab/tree/main/packages/title-bar)

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

```ts
// 以下代码添加到 src/main/index.ts 中
import { getEntry } from 'electron-lab';

mainWindow.loadURL(getEntry());
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

## 文档

### 使用多窗口

如果希望在应用中开发多个窗口，electron-lab 约定 `src/renderer/windows` 作为窗口的目录，在应用启动时会直接在该目录中查找。每一个目录都是一个独立的应用。

以 `settings` 窗口为例：

1. 创建入口文件：`src/renderer/windows/settings/index.tsx`

```ts
document.write('settings');
```

> 模版 html 将会使用 `src/renderer/public/index.html`。

2. 使用暴露的 Api 打开子窗口

```ts
import { openSubWindow, getEntry } from 'electron-lab';

const subWindow = openSubWindow({
  entry: getEntry('settings'),
});
```

## 交流&反馈
![IMG_7379](https://user-images.githubusercontent.com/20136563/132190873-fa05f20a-0ed3-427a-b532-6b5361acb160.JPG)
