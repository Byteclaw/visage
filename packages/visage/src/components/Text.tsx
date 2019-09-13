import React from 'react';
import { createComponent } from '../core';
import { EmotionStyleSheet } from '../types';
import { skeletonAnimation } from './animations';

const textStyles: EmotionStyleSheet = {
  display: 'inline',
  fontFamily: 'body',
  p: 0,
  m: 0,
  mb: 0,
};

export const Text = createComponent('span', {
  displayName: 'Text',
  defaultStyles: textStyles,
});

interface TextSkeletonProps {
  letters?: number;
}

export const TextSkeleton = createComponent(
  ({ letters = 6, ...restProps }: TextSkeletonProps) => {
    const mask = 'O'.repeat(letters);

    return <div data-mask={mask} {...restProps} />;
  },
  {
    displayName: 'TextSkeleton',
    defaultStyles: {
      ...textStyles,
      backfaceVisibility: 'hidden',
      display: 'inline-block',
      willChange: 'opacity',
      position: 'relative',
      animation: `${skeletonAnimation} .8s linear infinite alternate`,
      '&:before': {
        content: 'attr(data-mask)',
        backgroundColor: 'currentColor',
        fontSize: 'inherit',
        lineHeight: '1em',
      },
    },
  },
);
