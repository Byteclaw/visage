import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef, createElement } from 'react';
import { createComponent } from '../core';
import { variant } from '../variants';
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

const headingVariants: { [key: string]: EmotionStyleSheet } = {
  1: HeadingStyles.h1,
  2: HeadingStyles.h2,
  3: HeadingStyles.h3,
  4: HeadingStyles.h4,
  5: HeadingStyles.h5,
  6: HeadingStyles.h6,
};

const BaseHeading = createComponent('h1', {
  displayName: 'Heading',
  defaultStyles(props) {
    const variantStyles = headingVariants[props.level || '1'];

    return {
      fontFamily: 'heading',
      ...variantStyles,
    };
  },
  variants: [variant('level', true, [1, 2, 3, 4, 5, 6] as const, 1)],
});

export const Heading: typeof BaseHeading = forwardRef(
  ({ level, ...restProps }: any, ref: any) =>
    createElement(BaseHeading, {
      as: `h${level || '1'}`,
      ref,
      level,
      ...restProps,
    }),
) as any;

Heading.displayName = 'Heading';
markAsVisageComponent(Heading);

const defaultMask = [6];

export const HeadingSkeleton: VisageComponent<ExtractVisageComponentProps<
  typeof Heading
> & { mask?: number[] }> = function HeadingSkeleton({
  mask = defaultMask,
  ...restProps
}: any) {
  return <Heading as={SkeletonSentence} mask={mask} {...restProps} />;
};
