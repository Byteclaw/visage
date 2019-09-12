import { createComponent } from '../core';

export const Link = createComponent('a', {
  displayName: 'Link',
  defaultStyles: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'primary',
    '&:hover': {
      color: 'primary.-1',
    },
    '&:focus': {
      color: 'primary.-2',
      outlineColor: 'primary.-2',
    },
    '&:active': {
      color: 'primary.-3',
      outlineColor: 'primary.-3',
    },
  },
});
