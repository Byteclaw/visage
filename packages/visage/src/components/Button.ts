import { createComponent, createVariant } from '../core';

const ButtonBase = createComponent('button', {
  displayName: 'ButtonBase',
  defaultStyles: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderRadius: 3,
    borderWidth: 1,
    color: 'primary',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 0,
    fontWeight: 'normal',
    justifyContent: 'space-between',
    m: 1,
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
    active: {
      backgroundColor: 'primary.2',
      color: 'primaryText.2',
    },
    hover: {
      backgroundColor: 'primary.1',
      color: 'primaryText.1',
    },
    focus: {
      backgroundColor: 'primary.3',
      color: 'primaryText.3',
    },
  },
  default: {
    backgroundColor: 'default',
    borderColor: 'bodyText',
    color: 'bodyText',
  },
});
