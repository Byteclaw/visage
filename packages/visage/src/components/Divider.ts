import { createComponent } from '../core';

export const Divider = createComponent('hr', {
  displayName: 'Divider',
  defaultStyles: {
    borderLeft: 0,
    borderRight: 0,
    borderTop: 0,
    display: 'block',
    borderColor: 'greyLight',
    borderStyle: 'solid',
    minHeight: '2px',
    mx: 0,
    my: 0,
  },
});
