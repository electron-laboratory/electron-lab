import React, { CSSProperties, useEffect, useState } from 'react';
import cx from 'classnames';
import { ActionButton } from './components/ActionButton';
import './titlebar.less';

import {
  IconClose,
  IconMaximize,
  IconMinimize,
  IconRestore,
  IconRestoreDark,
} from './components/Icon';

type TitleBarProps = {
  backgroundColor?: CSSProperties['backgroundColor'];
  dark?: boolean;
  followBrowserWindowOptions?: boolean;
  hideButtonWhileDisable?: boolean;
  extra?: React.ReactNode;
};

const { platform } = process;

const classNamePrefix = 'electron-lab';
const getClassName = (className: string) => classNamePrefix + '-' + className;

const TitleBar: React.FC<TitleBarProps> = ({
  extra,
  backgroundColor,
  dark,
  children,
  followBrowserWindowOptions,
  hideButtonWhileDisable,
}) => {
  const title = children;
  const [dynamicTitle, setDynamicTitle] = useState(title || document.title);

  useEffect(() => {
    if (!title) {
      setDynamicTitle(document.title);
    }
  }, [document.title]);

  const restoreIcon = dark ? <IconRestoreDark></IconRestoreDark> : <IconRestore></IconRestore>;

  return (
    <div
      className={cx(getClassName('title-bar'), platform, {
        dark,
      })}
      style={{ backgroundColor }}
    >
      <div className={cx(getClassName('title'))}>{dynamicTitle}</div>
      <div className={cx(getClassName('flex-provider'))}>
        <div className={cx(getClassName('extra'))}>{extra}</div>
        {platform === 'win32' && (
          <div className={cx(getClassName('actions'))}>
            <ActionButton.Min
              followBrowserWindowOptions={followBrowserWindowOptions}
              hideButtonWhileDisable={hideButtonWhileDisable}
            >
              {able => {
                return (
                  <div className={cx(getClassName('action'), { disabled: !able })}>
                    <IconMinimize />
                  </div>
                );
              }}
            </ActionButton.Min>
            <ActionButton.Max
              followBrowserWindowOptions={followBrowserWindowOptions}
              hideButtonWhileDisable={hideButtonWhileDisable}
            >
              {(able, { isMax }) => {
                return (
                  <div className={cx(getClassName('action'), { disabled: !able })}>
                    {isMax ? restoreIcon : <IconMaximize />}
                  </div>
                );
              }}
            </ActionButton.Max>
            <ActionButton.Close
              followBrowserWindowOptions={followBrowserWindowOptions}
              hideButtonWhileDisable={hideButtonWhileDisable}
            >
              {able => {
                return (
                  <div
                    className={cx(getClassName('action'), getClassName('close'), {
                      disabled: !able,
                    })}
                  >
                    <IconClose />
                  </div>
                );
              }}
            </ActionButton.Close>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleBar;
