import React from 'react';

// from https://freeicons.io/icon-list/business-and-online-icons

export const WarningIcon = (props: JSX.IntrinsicElements['svg']) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M12 8v4M12 16h0" />
  </svg>
);
