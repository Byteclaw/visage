import { createComponent } from '../core';

export const Flex = createComponent('div', {
  displayName: 'Flex',
  defaultProps: {
    styles: {
      display: 'flex',
    },
  },
});
