import { createElement } from 'react';
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
    return createElement(
      'div',
      restProps,
      createElement('div', {
        style: { paddingBottom: `${height}%` },
      }),
    );
  },
  {
    displayName: 'BoxSkeleton',
    defaultStyles: {
      backgroundColor: 'currentColor',
      display: 'block',
      willChange: 'opacity',
      animation: `${skeletonAnimation} .8s linear infinite alternate`,
    },
  },
);
