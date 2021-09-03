import React, { CSSProperties, useEffect, useState } from 'react';
import cx from 'classnames';
import { ActionButton } from './components/ActionButton';
import './titlebar.less';

import { Restore, Close, Maximize, Minimize, RestoreDark } from './components/Icon';

type TitleBarProps = {
  title?: React.ReactNode;
  backgroundColor?: CSSProperties['backgroundColor'];
  dark?: boolean;
};

// const { platform } = process;
const platform = 'win32';

const classNamePrefix = 'electron-lab';
const getClassName = (className: string) => classNamePrefix + '-' + className;

const TitleBar: React.FC<TitleBarProps> = ({ title, backgroundColor, dark = true, children }) => {
  const [dynamicTitle, setDynamicTitle] = useState(title || document.title);

  useEffect(() => {
    if (!title) {
      setDynamicTitle(document.title);
    }
  }, [document.title]);

  const restoreIcon = true ? <RestoreDark></RestoreDark> : <Restore></Restore>;

  return (
    <div
      className={cx(getClassName('title-bar'), platform, {
        dark,
      })}
      style={{ backgroundColor }}
    >
      <div className={cx(getClassName('title'))}>{dynamicTitle}</div>
      <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>
      {platform === 'win32' && (
        <div className={cx(getClassName('actions'))}>
          <ActionButton.Min className={cx(getClassName('action'))}>
            <Minimize></Minimize>
          </ActionButton.Min>
          <ActionButton.Max className={cx(getClassName('action'))}>
            {isMax => {
              return isMax ? restoreIcon : <Maximize></Maximize>;
            }}
          </ActionButton.Max>
          <ActionButton.Max className={cx(getClassName('action'))}>
            <RestoreDark></RestoreDark>
          </ActionButton.Max>
          <ActionButton.Close className={cx(getClassName('action'), getClassName('close'))}>
            <Close />
          </ActionButton.Close>
        </div>
      )}
    </div>
  );
};

export default TitleBar;
