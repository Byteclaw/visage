import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import { keyframes } from '@emotion/core';
import React from 'react';
import { createBooleanVariant, createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';

const indeterminateAnimation = keyframes({
  '0%': {
    left: '-35%',
    right: '100%',
  },
  '60%': {
    left: '100%',
    right: '-90%',
  },
  '100%': {
    left: '100%',
    right: '-90%',
  },
});

const indeterminateVariant = createBooleanVariant('indeterminated', {
  onStyles: {
    animation: `${indeterminateAnimation} 2.1s ease-in-out infinite`,
    width: '35%',
    willChange: 'left, right',
  },
  offStyles: {
    transformOrigin: 0,
    transition: 'transform .5s cubic-bezier(0,0,.42,1)',
    width: '100%',
  },
});

const ProgressBarBase = createComponent('div', {
  displayName: 'ProgressBar',
  defaultStyles: {
    height: 4,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    '&:before': {
      backgroundColor: 'currentColor',
      content: '""',
      opacity: 0.2,
      display: 'block',
      width: '100%',
      height: '100%',
    },
  },
});

const ProgressBarProgress = indeterminateVariant(
  createComponent('div', {
    displayName: 'ProgressBarProgress',
    defaultStyles: {
      backgroundColor: 'currentColor',
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      maxWidth: '100%',
    },
  }),
);

export const Loading: VisageComponent<
  {
    baseProps?: ExtractVisageComponentProps<typeof ProgressBarBase>;
    indeterminated?: boolean;
    progressProps?: ExtractVisageComponentProps<typeof ProgressBarProgress>;
    value?: number;
    valueText?: string;
  },
  StyleProps
> = function Loading({
  baseProps,
  indeterminated,
  progressProps,
  value,
  valueText,
  ...restProps
}: any) {
  return (
    <ProgressBarBase
      role="progressbar"
      aria-valuemin={0}
      aria-valuenow={indeterminated ? undefined : value}
      aria-valuetext={valueText}
      aria-valuemax={100}
      {...baseProps}
      {...restProps}
    >
      <ProgressBarProgress
        indeterminated={indeterminated}
        style={
          indeterminated ? undefined : { transform: `scaleX(${value / 100})` }
        }
        {...progressProps}
      />
    </ProgressBarBase>
  );
};

markAsVisageComponent(Loading);
