import React from 'react';
import './iconfont.css';

const Close: React.FC = props => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 12 12">
      <polygon
        fill="currentColor"
        points="12,1 11,0 6,5 1,0 0,1 5,6 0,11 1,12 6,7 11,12 12,11 7,6"
      ></polygon>
    </svg>
  );
};
const Maximize: React.FC = props => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 10 10">
      <path
        fill="currentColor"
        d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z"
      ></path>
    </svg>
  );
};

const Minimize: React.FC = props => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 10 10">
      <rect fill="currentColor" width="10" height="1" x="0" y="9"></rect>
    </svg>
  );
};

const Restore: React.FC<{ dark?: boolean }> = props => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 10 10">
      <mask id="Mask">
        <rect fill="#FFFFFF" width="10" height="10"></rect>
        <path fill="currentColor" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z" />
        <path fill="currentColor" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
      </mask>
      <path
        fill="currentColor"
        d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z"
        mask="url(#Mask)"
      />
    </svg>
  );
};

const RestoreDark: React.FC = props => {
  return (
    <svg x="0px" y="0px" viewBox="0 0 10 10">
      <mask id="Mask">
        <rect fill="currentColor" width="10" height="10"></rect>
        <path fill="#000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z" />
        <path fill="#000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
      </mask>
      <path
        fill="currentColor"
        d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z"
        mask="url(#Mask)"
      />
    </svg>
  );
};

export { Restore, Close, Maximize, Minimize, RestoreDark };
