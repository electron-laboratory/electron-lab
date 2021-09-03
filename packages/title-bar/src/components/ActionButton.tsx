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

const Max: React.FC<HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode | undefined | ((isMax: boolean) => ReactNode);
}> = ({ children, ...rest }) => {
  const [state, setState] = useState<typeof WINDOW_STATE_MAX | typeof WINDOW_STATE_NORMAL>(
    'window/state/normal',
  );
  useEffect(() => {
    ipcRenderer.on(WINDOW_STATE, (e, args) => {
      setState(args);
    });
  }, []);
  let finalChildren = children;
  if (typeof children === 'function') {
    finalChildren = children(state === 'window/state/max');
  }
  return (
    <div
      {...rest}
      onClick={() => {
        ipcRenderer.send(WINDOW_MAXIMIZE);
      }}
    >
      {finalChildren}
    </div>
  );
};

const Min: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
  return (
    <div
      {...rest}
      onClick={() => {
        ipcRenderer.send(WINDOW_MINIMIZE);
      }}
    >
      {children}
    </div>
  );
};

const Close: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
  return (
    <div
      {...rest}
      onClick={() => {
        ipcRenderer.send(WINDOW_CLOSE);
      }}
    >
      {children}
    </div>
  );
};

export const ActionButton = {
  Max,
  Close,
  Min,
};
