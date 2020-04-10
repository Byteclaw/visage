import React from 'react';
import { createComponent } from '../core';
import { skeletonAnimation } from './animations';

/**
 * Paragraph component's style sheet
 */
export const ParagraphStyles: VisageStyleSheet = {
  display: 'block',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  p: 0,
  mx: 0,
  my: 2,
};

export const Paragraph = createComponent('p', {
  displayName: 'Paragraph',
  styles: ParagraphStyles,
});

interface ParagraphSkeletonProps {
  lines?: number;
}

export const ParagraphSkeleton = createComponent(
  ({ lines = 3, ...restProps }: ParagraphSkeletonProps) => {
    return (
      <div {...restProps}>
        {Array(lines)
          .fill(null)
          .map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i}>
              <div>&#x200b;</div>
            </div>
          ))}
      </div>
    );
  },
  {
    displayName: 'ParagraphSkeleton',
    styles: {
      ...ParagraphStyles,
      backfaceVisibility: 'hidden',
      willChange: 'opacity',
      animation: `${skeletonAnimation} .8s linear infinite alternate`,
      '& > div': {
        alignItems: 'center',
        display: 'flex',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        width: '100%',
      },
      '& > div > div': {
        backgroundColor: 'currentColor',
        fontSize: 'inherit',
        lineHeight: '1em',
        width: '100%',
      },
      '& > div:before': {
        // respect line height
        content: '"\\200b"',
        fontSize: 'inherit',
        lineHeight: 'inherit',
      },
      '& > div:last-child:not(:first-child)': {
        width: '80%',
      },
    },
  },
);
