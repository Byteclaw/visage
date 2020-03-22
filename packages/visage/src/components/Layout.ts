import { createComponent } from '../core';

export const Container = createComponent('div', {
  displayName: 'Container',
  styles: {
    display: 'flex',
    m: '0px',
    p: '0px',
    width: '100%',
  },
});

export const Column = createComponent('div', {
  displayName: 'Column',
  styles: {
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
  styles: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    m: '0px',
    p: '0px',
  },
});
