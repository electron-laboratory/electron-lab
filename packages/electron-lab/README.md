# Electron Lab

Electron 的研发脚手架，包含开发和构建脚本。

```shell
$ npm install electron-lab --save
```

## 使用

### 使用 NPX

```shell
$ npx el start
$ npx el build
```

### 使用 packages.json

```json
{
  "scripts": {
    "start": "el start",
    "build": "el build"
  }
}
```

## 参数

### start

| 参数      | 含义                         | 默认值 | 示例                        |
| --------- | ---------------------------- | ------ | --------------------------- |
| --inspect | 主进程 debug 的 inspect 端口 |        | `$ el start --inspect=3999` |
| --port    | 渲染进程 dev server 端口     |        | `$ el start --port=4001`    |

### build

| 参数     | 含义         | 默认值 | 示例                             |
| -------- | ------------ | ------ | -------------------------------- |
| --output | 打包输出路径 | ./dist | `$ el build --output=./some-dir` |

## 额外的脚手架配置

主进程和渲染进程都使用 webpack 打包，app 使用 electron-builder 打包，可以根据自己的需要增加额外一些配置。存放路径都在项目的根目录。

> 默认配置可以查看 node_modules/electron-lab/config

| 说明             | 路径                         |
| ---------------- | ---------------------------- |
| 主进程额外配置   | `main.webpack.config.js`     |
| 渲染进程额外配置 | `renderer.webpack.config.js` |
| builder 配置     | `electron-builder.config.js` |
