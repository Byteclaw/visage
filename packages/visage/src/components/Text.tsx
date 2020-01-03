import React from 'react';
import { createComponent } from '../core';
import { EmotionStyleSheet } from '../types';
import { skeletonAnimation } from './animations';

/**
 * Text component's stylesheet
 */
export const TextStyles: EmotionStyleSheet = {
  display: 'inline',
  fontFamily: 'inherit',
  p: 0,
  m: 0,
  mb: 0,
};

export const Text = createComponent('span', {
  displayName: 'Text',
  defaultStyles: TextStyles,
});

/**
 * EmphasizedText component's styles
 */
export const EmphasizedTextStyles: EmotionStyleSheet = {
  ...TextStyles,
  fontStyle: 'italic',
};

export const EmphasizedText = createComponent('small', {
  displayName: 'EmphasizedText',
  defaultStyles: EmphasizedTextStyles,
});

/**
 * SmallText component's styles
 */
export const SmallTextStyles: EmotionStyleSheet = {
  ...TextStyles,
  fontSize: -1,
  lineHeight: -1,
};

export const SmallText = createComponent('small', {
  displayName: 'SmallText',
  defaultStyles: SmallTextStyles,
});

/**
 * StrongText component's styles
 */
export const StrongTextStyles: EmotionStyleSheet = {
  ...TextStyles,
  fontWeight: 'bold',
};

export const StrongText = createComponent('strong', {
  displayName: 'StrongText',
  defaultStyles: StrongTextStyles,
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
      ...TextStyles,
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
