import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import { keyframes } from '@emotion/core';
import React from 'react';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';
import { StyleProps } from '../createNPointTheme';
import { EmotionStyleSheet } from '../types';

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

const indeterminateStyles: { on: EmotionStyleSheet; off: EmotionStyleSheet } = {
  on: {
    animation: `${indeterminateAnimation} 2.1s ease-in-out infinite`,
    width: '35%',
    willChange: 'left, right',
  },
  off: {
    transformOrigin: 0,
    transition: 'transform .5s cubic-bezier(0,0,.42,1)',
    width: '100%',
  },
};

const ProgressBarBase = createComponent('div', {
  displayName: 'LoadingProgressBar',
  defaultStyles: props => ({
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
    ...(props.indeterminate ? indeterminateStyles.on : indeterminateStyles.off),
  }),
  variants: [booleanVariant('indeterminate', true)],
});

const ProgressBarProgress = createComponent('div', {
  displayName: 'LoadingProgressBarProgress',
  defaultStyles: props => ({
    backgroundColor: 'currentColor',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    maxWidth: '100%',
    ...(props.indeterminate ? indeterminateStyles.on : indeterminateStyles.off),
  }),
  variants: [booleanVariant('indeterminate', true)],
});

export const Loading: VisageComponent<
  {
    baseProps?: ExtractVisageComponentProps<typeof ProgressBarBase>;
    indeterminate?: boolean;
    progressProps?: ExtractVisageComponentProps<typeof ProgressBarProgress>;
    value?: number;
    valueText?: string;
  },
  StyleProps
> = function Loading({
  baseProps,
  indeterminate,
  progressProps,
  value,
  valueText,
  ...restProps
}: any) {
  return (
    <ProgressBarBase
      role="progressbar"
      aria-valuemin={0}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuetext={valueText}
      aria-valuemax={100}
      {...baseProps}
      {...restProps}
    >
      <ProgressBarProgress
        indeterminate={indeterminate}
        style={
          indeterminate ? undefined : { transform: `scaleX(${value / 100})` }
        }
        {...progressProps}
      />
    </ProgressBarBase>
  );
};

markAsVisageComponent(Loading);
