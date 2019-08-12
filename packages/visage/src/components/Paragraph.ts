import { createComponent } from '../core';

export const Paragraph = createComponent('p', {
  displayName: 'Paragraph',
  defaultStyles: {
    display: 'block',
    fontSize: 0,
    lineHeight: 0,
    p: 0,
    mx: 0,
    my: 2,
    maxWidth: '80ch',
  },
});
