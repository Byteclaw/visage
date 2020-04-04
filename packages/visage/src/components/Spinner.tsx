import { keyframes } from '@emotion/core';
import React from 'react';
import { createComponent } from '../core';
import { SpinnerIcon } from '../assets';

// thanks to https://codepen.io/aleksander351/pen/KzgKPo

const circleDashAnimation = keyframes({
  '0%': {
    strokeDasharray: '1, 200',
    strokeDashoffset: 0,
  },
  '50%': {
    strokeDasharray: '89, 200',
    strokeDashoffset: -35,
  },
  '100%': {
    strokeDasharray: '89, 200',
    strokeDashoffset: -124,
  },
});

export const Spinner = createComponent('div', {
  displayName: 'SpinnerSvgBase',
  defaultProps: {
    children: <SpinnerIcon />,
    role: 'status',
  },
  styles: {
    alignItems: 'center',
    display: 'inline-flex',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    '&::before': {
      // respect line height
      content: '"\\200b"',
    },
    '& svg': {
      height: '1em',
      transformOrigin: 'center center',
      verticalAlign: 'middle',
    },
    '& circle': {
      animation: `${circleDashAnimation} 1.5s ease-in-out infinite`,
      strokeDasharray: '150, 200',
      strokeDashoffset: -10,
      strokeLinecap: 'round',
    },
  },
});
