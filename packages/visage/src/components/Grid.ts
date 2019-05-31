import { createComponent } from '../core';

export const Grid = createComponent('div', {
  displayName: 'Grid',
  defaultProps: {
    styles: {
      display: 'grid',
    },
  },
});
