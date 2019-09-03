import React from 'react';

export const ErrorIcon = (props: JSX.IntrinsicElements['svg']) => (
  <svg viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd">
      <path d="M-2-2h24v24H-2z" />
      <path
        d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
        fill="currentColor"
      />
    </g>
  </svg>
);
