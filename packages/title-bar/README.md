# @electron-lab/title-bar

提供了自定义标题栏的基本封装以及一个标准的 Windows 标题栏。

## 使用

1. 渲染进程中引入

```tsx
import TitleBar from '@electron-lab/title-bar';

<TitleBar title="Electron Lab" />;
```

2. 在主进程中引入

```ts
import { initWindowListener } from '@electron-lab/title-bar/lib/main';

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

## 自定义按钮

```tsx
import { ActionButton } from '@electron-lab/title-bar';

<ActionButton.Min>minimize window</ActionButton.Min>;
<ActionButton.Min>
  {isMax => {
    return <Button> {isMax ? 'restore' : 'maximize'} </Button>;
  }}
</ActionButton.Min>;
<ActionButton.Close>close window</ActionButton.Close>;
```
