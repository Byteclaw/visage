import { createComponent } from '../core';

export const Container = createComponent('div', {
  displayName: 'Container',
  defaultStyles: {
    display: 'flex',
    m: '0px',
    p: '0px',
    width: '100%',
  },
});

export const Column = createComponent('div', {
  displayName: 'Column',
  defaultStyles: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    m: '0px',
    p: '0px',
  },
});

export const Row = createComponent('div', {
  displayName: 'Row',
  defaultStyles: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    m: '0px',
    p: '0px',
  },
});
