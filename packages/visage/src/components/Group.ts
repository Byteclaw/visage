import { createComponent } from '../core';

export const Group = createComponent('div', {
  displayName: 'Group',
  styles: {
    display: 'inline-flex',
    flexDirection: 'row',
    verticalAlign: 'middle',
    '& > *': {
      m: '0',
    },
    '& > *:not(:first-of-type)': {
      ml: '-1px',
      // borderLeftColor: 'transparent',
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
    },
    '& > *:not(:last-child)': {
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
    },
  },
});
