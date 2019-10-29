import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef, createElement } from 'react';
import { createComponent } from '../core';
import { variant } from '../variants';
import { SkeletonSentence } from './SkeletonSentence';
import { StyleProps } from '../createNPointTheme';

const headingVariants: { [key: string]: StyleProps } = {
  1: {
    fontSize: 4,
    lineHeight: 4,
    mt: 2,
    mb: 1,
    fontWeight: 'normal',
  },
  2: {
    fontSize: 3,
    lineHeight: 3,
    mt: 1,
    mb: 1,
    fontWeight: 'normal',
  },
  3: {
    fontSize: 2,
    lineHeight: 2,
    mt: 1,
    mb: 1,
    fontWeight: 'normal',
  },
  4: {
    fontSize: 1,
    lineHeight: 1,
    mt: 1,
    mb: 1,
    fontWeight: 'normal',
  },
  5: {
    fontSize: 0,
    lineHeight: 0,
    fontWeight: 'normal',
    mt: 1,
    mb: 1,
  },
  6: {
    fontSize: 0,
    lineHeight: 0,
    fontWeight: 'normal',
    fontStyle: 'italic',
    mt: 1,
    mb: 1,
  },
  default: {
    fontSize: 0,
    lineHeight: 0,
    fontWeight: 'normal',
    fontStyle: 'italic',
    mt: 1,
    mb: 1,
  },
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

export const HeadingSkeleton: VisageComponent<
  ExtractVisageComponentProps<typeof Heading> & { mask?: number[] },
  StyleProps
> = function HeadingSkeleton({ mask = defaultMask, ...restProps }: any) {
  return <Heading as={SkeletonSentence} mask={mask} {...restProps} />;
};
