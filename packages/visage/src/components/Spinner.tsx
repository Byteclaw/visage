import { markAsVisageComponent, VisageComponent } from '@byteclaw/visage-core';
import { keyframes } from '@emotion/core';
import React, { ReactElement, FunctionComponent } from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
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

const rotateAnimation = keyframes({
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const SvgIconBase = createComponent('div', {
  displayName: 'SvgIconBase',
  defaultStyles: {
    alignItems: 'center',
    display: 'inline-flex',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    '&::before': {
      // respect line height
      content: '"\\200b"',
    },
    '& svg': {
      animation: `${rotateAnimation} 2s linear`,
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

export const Spinner: VisageComponent<
  {
    icon: ReactElement | FunctionComponent<any>;
    stroked?: boolean;
    iconProps?: JSX.IntrinsicElements['svg'];
  },
  StyleProps
> = function Spinner({ icon: Icon, iconProps, ...restProps }: any) {
  return (
    <SvgIconBase {...restProps}>
      <SpinnerIcon />
    </SvgIconBase>
  );
};

markAsVisageComponent(Spinner);
