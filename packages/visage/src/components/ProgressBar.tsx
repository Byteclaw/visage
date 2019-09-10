import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
import { visuallyHiddenStyles } from './shared';

const HiddenProgressBar = createComponent('progress', {
  defaultStyles: visuallyHiddenStyles,
});

const ProgressBarBase = createComponent('div', {
  displayName: 'ProgressBar',
  defaultStyles: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    '&:before': {
      backgroundColor: 'currentColor',
      content: '"\\200b"',
      display: 'inline-block',
      lineHeight: '100%',
      opacity: 0.2,
      width: '100%',
    },
  },
});

const ProgressBarProgress = createComponent('div', {
  displayName: 'ProgressBarProgress',
  defaultStyles: {
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

export const ProgressBar: VisageComponent<
  {
    baseProps?: ExtractVisageComponentProps<typeof ProgressBarBase>;
    progressProps?: ExtractVisageComponentProps<typeof ProgressBarProgress>;
    value: number;
    valueText?: string;
  },
  StyleProps
> = function ProgressBar({
  baseProps,
  progressProps,
  value,
  valueText,
  ...restProps
}: any) {
  return (
    <ProgressBarBase {...baseProps} {...restProps}>
      <HiddenProgressBar aria-valuetext={valueText} value={value} max={100} />
      <ProgressBarProgress style={{ width: `${value}%` }} {...progressProps} />
    </ProgressBarBase>
  );
};

markAsVisageComponent(ProgressBar);
