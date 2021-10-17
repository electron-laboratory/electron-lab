import React, { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');
import {
  WINDOW_CLOSE,
  WINDOW_IS_CLOSABLE,
  WINDOW_IS_MAXIMIZABLE,
  WINDOW_IS_MINIMIZABLE,
  WINDOW_MAXIMIZE,
  WINDOW_MINIMIZE,
  WINDOW_STATE,
  WINDOW_STATE_MAX,
  WINDOW_STATE_NORMAL,
} from '../constants';

const Max: React.FC<HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode | undefined | ((able: boolean, state: { isMax: boolean }) => ReactNode);
  followBrowserWindowOptions?: boolean;
  hideButtonWhileDisable?: boolean;
  windowId: string;
}> = ({
  children,
  followBrowserWindowOptions,
  hideButtonWhileDisable,
  windowId = 'index',
  ...rest
}) => {
  const [state, setState] = useState<typeof WINDOW_STATE_MAX | typeof WINDOW_STATE_NORMAL>(
    'window/state/normal',
  );

  const [isMaximizable, setIsMaxmizable] = useState(false);

  useEffect(() => {
    ipcRenderer.on(WINDOW_STATE, (e, args) => {
      setState(args);
    });

    ipcRenderer.invoke(WINDOW_IS_MAXIMIZABLE, { windowId }).then(result => {
      setIsMaxmizable(result);
    });
  }, []);

  const maximizable = followBrowserWindowOptions ? isMaximizable : true;
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
            maximizable && ipcRenderer.send(WINDOW_MAXIMIZE, { windowId });
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
  windowId: string;
}> = ({
  children,
  followBrowserWindowOptions,
  hideButtonWhileDisable,
  windowId = 'index',
  ...rest
}) => {
  const [isMinimizable, setIsMinmizable] = useState(false);
  useEffect(() => {
    ipcRenderer.invoke(WINDOW_IS_MINIMIZABLE, { windowId }).then(result => {
      setIsMinmizable(result);
    });
  }, []);

  const minimizable = followBrowserWindowOptions ? isMinimizable : true;
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
            minimizable && ipcRenderer.send(WINDOW_MINIMIZE, { windowId });
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
  windowId: string;
}> = ({
  children,
  followBrowserWindowOptions,
  hideButtonWhileDisable,
  windowId = 'index',
  ...rest
}) => {
  const [isClosable, setIsClosable] = useState(false);
  useEffect(() => {
    ipcRenderer.invoke(WINDOW_IS_CLOSABLE, { windowId }).then(result => {
      setIsClosable(result);
    });
  }, []);

  const closable = followBrowserWindowOptions ? isClosable : true;
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
            closable && ipcRenderer.send(WINDOW_CLOSE, { windowId });
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
