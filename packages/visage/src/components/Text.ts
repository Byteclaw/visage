import { createComponent } from '../core';

export const Text = createComponent('span', {
  displayName: 'Text',
  defaultStyles: {
    display: 'inline',
    fontFamily: 'body',
    p: 0,
    m: 0,
    mb: 0,
  },
});
