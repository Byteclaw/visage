import React from 'react';
import { createComponent, EmotionStyleSheet } from '../core';
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

    return (
      <div data-mask={mask} {...restProps}>
        <div>&#x200b;</div>
      </div>
    );
  },
  {
    displayName: 'TextSkeleton',
    defaultStyles: {
      ...textStyles,
      backfaceVisibility: 'hidden',
      display: 'inline-block',
      willChange: 'opacity',
      animation: `${skeletonAnimation} .8s linear infinite alternate`,
      '& > div': {
        backgroundColor: 'bodyText',
        display: 'block',
        fontSize: 'inherit',
        lineHeight: '1em',
        width: '100%',
      },
      '&:before': {
        content: 'attr(data-mask)',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        visibility: 'hidden',
      },
    },
  },
);
