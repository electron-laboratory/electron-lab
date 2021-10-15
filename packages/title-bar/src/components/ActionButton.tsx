import React, { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');
import {
  WINDOW_CLOSE,
  WINDOW_MAXIMIZE,
  WINDOW_MINIMIZE,
  WINDOW_STATE,
  WINDOW_STATE_MAX,
  WINDOW_STATE_NORMAL,
} from '../constants';

import remote from '@electron/remote';

const Max: React.FC<HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode | undefined | ((able: boolean, state: { isMax: boolean }) => ReactNode);
  followBrowserWindowOptions?: boolean;
  hideButtonWhileDisable?: boolean;
}> = ({ children, followBrowserWindowOptions, hideButtonWhileDisable, ...rest }) => {
  const [state, setState] = useState<typeof WINDOW_STATE_MAX | typeof WINDOW_STATE_NORMAL>(
    'window/state/normal',
  );
  useEffect(() => {
    ipcRenderer.on(WINDOW_STATE, (e, args) => {
      setState(args);
    });
  }, []);

  const { isMaximizable } = remote.getCurrentWindow();
  const maximizable = followBrowserWindowOptions ? isMaximizable() : true;
  const shouldRenderMaxmizable = !(hideButtonWhileDisable && !maximizable);

  let finalChildren = children;

  if (typeof children === 'function') {
    finalChildren = children(maximizable, { isMax: state === 'window/state/max' });
  }

  return (
    <>
      {shouldRenderMaxmizable && (
        <div
          {...rest}
          onClick={() => {
            maximizable && ipcRenderer.send(WINDOW_MAXIMIZE);
          }}
        >
          {finalChildren}
        </div>
      )}
    </>
  );
};

const Min: React.FC<HTMLAttributes<HTMLDivElement> & {
  followBrowserWindowOptions?: boolean;
  hideButtonWhileDisable?: boolean;
  children?: ReactNode | undefined | ((able: boolean) => ReactNode);
}> = ({ children, followBrowserWindowOptions, hideButtonWhileDisable, ...rest }) => {
  const { isMinimizable } = remote.getCurrentWindow();
  const minimizable = followBrowserWindowOptions ? isMinimizable() : true;
  const shouldRenderMinimizable = !(hideButtonWhileDisable && !minimizable);

  let finalChildren = children;
  if (typeof children === 'function') {
    finalChildren = children(minimizable);
  }

  return (
    <>
      {shouldRenderMinimizable && (
        <div
          {...rest}
          onClick={() => {
            minimizable && ipcRenderer.send(WINDOW_MINIMIZE);
          }}
        >
          {finalChildren}
        </div>
      )}
    </>
  );
};

const Close: React.FC<HTMLAttributes<HTMLDivElement> & {
  followBrowserWindowOptions?: boolean;
  hideButtonWhileDisable?: boolean;
  children?: ReactNode | undefined | ((able: boolean) => ReactNode);
}> = ({ children, followBrowserWindowOptions, hideButtonWhileDisable, ...rest }) => {
  const { isClosable } = remote.getCurrentWindow();
  const closable = followBrowserWindowOptions ? isClosable() : true;
  const shouldRenderClosable = !(hideButtonWhileDisable && !closable);
  let finalChildren = children;
  if (typeof children === 'function') {
    finalChildren = children(closable);
  }
  return (
    <>
      {shouldRenderClosable && (
        <div
          {...rest}
          onClick={() => {
            closable && ipcRenderer.send(WINDOW_CLOSE);
          }}
        >
          {finalChildren}
        </div>
      )}
    </>
  );
};

export const ActionButton = {
  Max,
  Close,
  Min,
};
