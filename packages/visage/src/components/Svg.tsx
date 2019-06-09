import { createComponent } from '../core';

export const Svg = createComponent('svg', {
  defaultStyles: {
    display: 'inline',
    verticalAlign: 'top',
    'path:last-child': {},
  },
});
