# @electron-lab/title-bar

提供了自定义标题栏的基本封装以及一个标准的 Windows 标题栏。

## 使用

1. 渲染进程中引入

```tsx
import TitleBar from '@electron-lab/title-bar';

<TitleBar>Electron Lab</TitleBar>;
```

2. 在主进程中引入

```ts
import { initWindowListener } from '@electron-lab/title-bar/main';

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    frame: false,
  });
  initWindowListener(mainWindow);
};
app.on('ready', createWindow);
```

### 多窗口时使用

为了在多窗口时使用，需要对每个窗口设置单独的 windowId。

example:

```ts
import { initWindowListener } from '@electron-lab/title-bar/main';

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    frame: false,
  });

  initWindowListener(mainWindow, 'index');
  // <TitleBar windowId="index" />

  const subWindow = new BrowserWindow({});
  initWindowListener(subWindow, 'sub');
  // <TitleBar windowId="sub" />
};
app.on('ready', createWindow);
```

如果不设置 windowId，则默认为 "index"。

## 自定义按钮

```tsx
import { ActionButton } from '@electron-lab/title-bar';

<ActionButton.Min>minimize window</ActionButton.Min>;
<ActionButton.Min>
  {(able, { isMax }) => {
    return <Button> {isMax ? 'restore' : 'maximize'} </Button>;
  }}
</ActionButton.Min>;
<ActionButton.Close>close window</ActionButton.Close>;
```

## API

### \<TitleBar {...} /\>

| 参数 Prop | 说明 comment | 类型 Type | 默认值 Default Value | 示例 Example |
| --- | --- | --- | --- | --- |
| extra | 标题栏额外的渲染区域 | React.ReactNode |  | extra={\<Button>设置\</Button>} |
| backgroundColor | 背景颜色 | CSSProperties['backgroundColor'] |  | backgroundColor="red" |
| dark | 黑夜模式 | boolean |  | dark={true} |
| followBrowserWindowOptions | 是否跟随窗口的设置（假如对应的窗口设置了 isMaximizable，则按钮的最大化按钮会变成 disabled） | boolean |  | followBrowserWindowOptions={true} |
| hideButtonWhileDisable | 跟随窗口设置时，是否隐藏按钮 | boolean |  | hideButtonWhileDisable={false} |
| windowId | 窗口 id | string | "index" | windowId="index" |

### \<ActionButton.Max {...} />

| 参数 Prop | 说明 comment | 类型 Type | 默认值 Default Value | 示例 Example |
| --- | --- | --- | --- | --- |
| children | 渲染的内容 | ReactNode \| undefined \| ((able: boolean, state: { isMax: boolean }) => ReactNode) |  | \<ActionButton.Max>{(able,{isMax})=>\<div>isMax: {isMax}\</div>}\</ActionButton.Max> |
| followBrowserWindowOptions | 同 TitleBar.followBrowserWindowOptions |  |  |  |
| hideButtonWhileDisable | 同 TitleBar.hideButtonWhileDisable |  |  |  |
| windowId | 同 TitleBar.windowId |  |  |  |

### \<ActionButton.Min {...} /> | \<ActionButton.Close {...} />

| 参数 Prop | 说明 comment | 类型 Type | 默认值 Default Value | 示例 Example |
| --- | --- | --- | --- | --- |
| children | 渲染的内容 | ReactNode \| undefined \| ((able: boolean) => ReactNode) |  | \<ActionButton.Max>{(able,{isMax})=>\<div>isMax: {isMax}\</div>}\</ActionButton.Max> |
| followBrowserWindowOptions | 同 TitleBar.followBrowserWindowOptions |  |  |  |
| hideButtonWhileDisable | 同 TitleBar.hideButtonWhileDisable |  |  |  |
| windowId | 同 TitleBar.windowId |  |  |  |

### initWindowListener

初始化窗口控制的主进程 ipc 通讯监听。

`initWindowListener: (window: electron.BrowserWindow,windowId?:string)`

windowId 不设置则为 "index"

example:

```ts
import { initWindowListener } from '@electron-lab/title-bar/main';
const mainWindow = new BrowserWindow({
  width: 1440,
  height: 900,
  frame: false,
});

initWindowListener(mainWindow, 'index');
// <TitleBar windowId="index" />
```

### removeWindowListener

移除窗口控制的主进程 ipc 通讯监听。这个方法会在窗口关闭时自动执行移除，一般不需要使用。

`removeWindowListener: (windowId:string)`

example:

```ts
import { initWindowListener, removeWindowListener } from '@electron-lab/title-bar/main';
const mainWindow = new BrowserWindow({
  width: 1440,
  height: 900,
  frame: false,
});

initWindowListener(mainWindow, 'index');
// <TitleBar windowId="index" />

// in some callback
() => {
  removeWindowListener('index');
};
```
