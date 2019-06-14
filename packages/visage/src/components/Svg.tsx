import { createComponent, createVariant } from '../core';

const SvgBase = createComponent('svg', {
  displayName: 'Svg',
  defaultStyles: {
    display: 'inline',
    lineHeight: 0,
    linedHeight: 0,
    fontSize: 0,
    verticalAlign: 'middle',
  },
});

export const Svg = createVariant(SvgBase, 'variant', {
  stroked: {
    'path:last-child': {
      fill: 'transparent',
      stroke: 'bodyText',
    },
  },
  default: {
    'path:last-child': {
      fill: 'bodyText',
    },
  },
});
