import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { createElement, forwardRef } from 'react';
import { createComponent, createVariant } from '../core';
import { SkeletonSentence } from './SkeletonSentence';
import { StyleProps } from '../createNPointTheme';

const HeadingBase = createComponent('h1', {
  displayName: 'HeadingBase',
  defaultStyles: {
    fontFamily: 'heading',
  },
});

const VariantedHeading = createVariant(
  HeadingBase,
  'level',
  {
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
  },
  1,
);

export const Heading: typeof VariantedHeading = forwardRef(
  ({ level, ...restProps }: any, ref: any) =>
    createElement(VariantedHeading, {
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
