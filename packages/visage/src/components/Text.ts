import { createComponent } from '../core';

export const Text = createComponent('span', {
  displayName: 'Text',
  defaultStyles: {
    fontFamily: 'body',
    mb: 0,
  },
});
