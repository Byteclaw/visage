import { createComponent, createVariant } from '../core';

const ButtonBase = createComponent('button', {
  displayName: 'ButtonBase',
  defaultStyles: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderRadius: 0,
    borderWidth: 1,
    color: 'primary',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 0,
    fontFamily: 'body',
    fontWeight: 'normal',
    justifyContent: 'space-between',
    minHeight: '2rem',
    maxWidth: '20rem',
    outlineStyle: 'solid',
    outlineColor: 'transparent',
    outlineWidth: 3,
    p: 1,
    position: 'relative',
    textDecoration: 'none',
    verticalAlign: 'middle',
  },
});

export const Button = createVariant(ButtonBase, 'variant', {
  primary: {
    backgroundColor: 'primary',
    borderColor: 'primary',
    color: 'primaryText',
    '&:active': {
      backgroundColor: 'primary.-2',
      borderColor: 'primary.-2',
      color: 'primaryText.-2',
    },
    '&:focus': {
      backgroundColor: 'primary.-3',
      borderColor: 'primary.-3',
      color: 'primaryText.-3',
    },
    '&:hover': {
      backgroundColor: 'primary.-1',
      borderColor: 'primary.-1',
      color: 'primaryText.-1',
    },
  },
  default: {
    backgroundColor: 'neutral',
    borderColor: 'neutral',
    color: 'neutralText',
    '&:active': {
      backgroundColor: 'neutral.-2',
      borderColor: 'neutral.-2',
      color: 'neutralText.-2',
    },
    '&:focus': {
      backgroundColor: 'neutral.-3',
      borderColor: 'neutral.-3',
      color: 'neutralText.-3',
    },
    '&:hover': {
      backgroundColor: 'neutral.-1',
      borderColor: 'neutral.-1',
      color: 'neutralText.-1',
    },
  },
});
