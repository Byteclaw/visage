import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import { keyframes } from '@emotion/core';
import React from 'react';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';

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

const indeterminateStyles: { on: VisageStyleSheet; off: VisageStyleSheet } = {
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
  styles: props => ({
    height: 4,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    borderRadius: 'controlBorderRadius',
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
  styles: props => ({
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

interface LoadingProps {
  baseProps?: ExtractVisageComponentProps<typeof ProgressBarBase>;
  indeterminate?: boolean;
  progressProps?: ExtractVisageComponentProps<typeof ProgressBarProgress>;
  /**
   * @default 0
   */
  value?: number;
  valueText?: string;
}

export const Loading = markAsVisageComponent(function Loading({
  baseProps,
  indeterminate,
  progressProps,
  value = 0,
  valueText,
  ...restProps
}: LoadingProps) {
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
});
