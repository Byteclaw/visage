import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React from 'react';
import { createComponent } from '../core';
import { visuallyHiddenStyles } from './shared';

const HiddenProgressBar = createComponent('progress', {
  styles: visuallyHiddenStyles,
});

const ProgressBarBase = createComponent('div', {
  displayName: 'ProgressBar',
  styles: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    '&:before': {
      backgroundColor: 'currentColor',
      content: '"\\200b"',
      display: 'inline-block',
      opacity: 0.2,
      width: '100%',
    },
  },
});

const ProgressBarProgress = createComponent('div', {
  displayName: 'ProgressBarProgress',
  styles: {
    '&::before': {
      backgroundColor: 'currentColor',
      content: '"\\200b"',
      display: 'inline-block',
      lineHeight: '100%',
      width: '100%',
    },
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    maxWidth: '100%',
    willChange: 'width',
    transition: 'width .5s cubic-bezier(.64,0,.35,1)',
  },
});

interface ProgressBarProps {
  baseProps?: ExtractVisageComponentProps<typeof ProgressBarBase>;
  progressProps?: ExtractVisageComponentProps<typeof ProgressBarProgress>;
  /**
   * @default 100
   */
  max?: number;
  value: number;
  valueText?: string;
}

export const ProgressBar = markAsVisageComponent(function ProgressBar({
  baseProps,
  max = 100,
  progressProps,
  value,
  valueText,
  ...restProps
}: ProgressBarProps) {
  return (
    <ProgressBarBase {...baseProps} {...restProps}>
      <HiddenProgressBar aria-valuetext={valueText} value={value} max={max} />
      <ProgressBarProgress
        style={{ width: `${(100 / max) * value}%` }}
        {...progressProps}
      />
    </ProgressBarBase>
  );
});
