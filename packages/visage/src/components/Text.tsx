import React from 'react';
import { createComponent } from '../core';
import { skeletonAnimation } from './animations';

/**
 * Text component's stylesheet
 */
export const TextStyles: VisageStyleSheet = {
  display: 'inline',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  p: 0,
  m: 0,
  mb: 0,
};

export const Text = createComponent('span', {
  displayName: 'Text',
  styles: TextStyles,
});

/**
 * EmphasizedText component's styles
 */
export const EmphasizedTextStyles: VisageStyleSheet = {
  ...TextStyles,
  fontStyle: 'italic',
};

export const EmphasizedText = createComponent('small', {
  displayName: 'EmphasizedText',
  styles: EmphasizedTextStyles,
});

/**
 * SmallText component's styles
 */
export const SmallTextStyles: VisageStyleSheet = {
  ...TextStyles,
  fontSize: -1,
  lineHeight: -1,
};

export const SmallText = createComponent('small', {
  displayName: 'SmallText',
  styles: SmallTextStyles,
});

/**
 * StrongText component's styles
 */
export const StrongTextStyles: VisageStyleSheet = {
  ...TextStyles,
  fontWeight: 'bold',
};

export const StrongText = createComponent('strong', {
  displayName: 'StrongText',
  styles: StrongTextStyles,
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
    styles: {
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
