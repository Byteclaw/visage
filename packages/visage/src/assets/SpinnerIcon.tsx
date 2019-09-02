import React from 'react';

export const SpinnerIcon = (props: JSX.IntrinsicElements['svg']) => (
  <svg viewBox="25 25 50 50" {...props}>
    <circle
      cx={50}
      cy={50}
      r={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
);
