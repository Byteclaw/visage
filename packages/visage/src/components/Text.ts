import { createComponent } from '../core';

export const Text = createComponent('span', {
  displayName: 'Text',
  defaultProps: {
    styles: {
      fontFamily: 'body',
    },
  },
});
