import { markAsVisageComponent, VisageComponent } from '@byteclaw/visage-core';
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

const SpinnerSvgBase = createComponent('div', {
  displayName: 'SpinnerSvgBase',
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

export const Spinner: VisageComponent<{}> = function Spinner(props: any) {
  return (
    <SpinnerSvgBase role="status" {...props}>
      <SpinnerIcon />
    </SpinnerSvgBase>
  );
};

markAsVisageComponent(Spinner);
