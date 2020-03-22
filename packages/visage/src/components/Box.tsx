import React from 'react';
import { createComponent } from '../core';
import { skeletonAnimation } from './animations';

export const Box = createComponent('div', {
  displayName: 'Box',
});

export const BoxSkeleton = createComponent(
  ({
    aspectRatio = 1,
    ...restProps
  }: JSX.IntrinsicElements['div'] & { aspectRatio?: number }) => {
    const height = 100 / aspectRatio;

    return (
      <div {...restProps}>
        <div style={{ paddingBottom: `${height}%` }} />
      </div>
    );
  },
  {
    displayName: 'BoxSkeleton',
    styles: {
      backgroundColor: 'currentColor',
      display: 'block',
      willChange: 'opacity',
      animation: `${skeletonAnimation} .8s linear infinite alternate`,
      width: '100%',
    },
  },
);
