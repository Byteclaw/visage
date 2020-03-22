import { markAsVisageComponent, VisageComponent } from '@byteclaw/visage-core';
import React, { forwardRef, createElement } from 'react';
import { createComponent } from '../core';
import { SkeletonSentence } from './SkeletonSentence';
import { EmotionStyleSheet } from '../types';

/**
 * Heading component's styles
 */
export const HeadingStyles: {
  h1: EmotionStyleSheet;
  h2: EmotionStyleSheet;
  h3: EmotionStyleSheet;
  h4: EmotionStyleSheet;
  h5: EmotionStyleSheet;
  h6: EmotionStyleSheet;
} = {
  h1: {
    fontFamily: 'heading',
    fontSize: 7,
    fontWeight: 'normal',
    lineHeight: 7,
    mt: 2,
    mb: 1,
  },
  h2: {
    fontFamily: 'heading',
    fontSize: 5,
    lineHeight: 5,
    mt: 1,
    mb: 1,
    fontWeight: 'normal',
  },
  h3: {
    fontFamily: 'heading',
    fontSize: 4,
    lineHeight: 4,
    mt: 1,
    mb: 1,
    fontWeight: 'normal',
  },
  h4: {
    fontFamily: 'heading',
    fontSize: 3,
    lineHeight: 3,
    mt: 1,
    mb: 1,
    fontWeight: 'normal',
  },
  h5: {
    fontFamily: 'heading',
    fontSize: 2,
    lineHeight: 2,
    fontWeight: 'normal',
    mt: 1,
    mb: 1,
  },
  h6: {
    fontFamily: 'heading',
    fontSize: 1,
    fontStyle: 'italic',
    fontWeight: 'normal',
    lineHeight: 1,
    mb: 1,
    mt: 1,
  },
};

const h1 = createComponent('h1', {
  displayName: 'h1',
  styles: HeadingStyles.h1,
});

const h2 = createComponent('h2', {
  displayName: 'h2',
  styles: HeadingStyles.h2,
});

const h3 = createComponent('h3', {
  displayName: 'h3',
  styles: HeadingStyles.h3,
});

const h4 = createComponent('h4', {
  displayName: 'h4',
  styles: HeadingStyles.h4,
});

const h5 = createComponent('h5', {
  displayName: 'h5',
  styles: HeadingStyles.h5,
});

const h6 = createComponent('h6', {
  displayName: 'h6',
  styles: HeadingStyles.h6,
});

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: VisageComponent<JSX.IntrinsicElements['h1'] &
  HeadingProps> = React.memo(
  forwardRef(
    (
      { level = 1, ...restProps }: JSX.IntrinsicElements['h1'] & HeadingProps,
      ref: any,
    ) => {
      let as = h1;

      switch (level) {
        case 2:
          as = h2;
          break;
        case 3:
          as = h3;
          break;
        case 4:
          as = h4;
          break;
        case 5:
          as = h5;
          break;
        case 6:
          as = h6;
      }

      return createElement(as, {
        ref,
        // @ts-ignore
        'data-level': level,
        ...restProps,
      });
    },
  ),
) as any;

Heading.displayName = 'Heading';
markAsVisageComponent(Heading);

const defaultMask = [6];

export const HeadingSkeleton: VisageComponent<JSX.IntrinsicElements['h1'] &
  HeadingProps & { mask?: number[] }> = function HeadingSkeleton({
  mask = defaultMask,
  ...restProps
}: any) {
  return <Heading as={SkeletonSentence} mask={mask} {...restProps} />;
};
