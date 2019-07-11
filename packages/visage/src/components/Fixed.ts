import { createComponent } from '../core';

export const Fixed = createComponent('div', {
  displayName: 'Fixed',
  defaultStyles: {
    position: 'fixed',
  },
});
