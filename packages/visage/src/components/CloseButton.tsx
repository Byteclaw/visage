import React from 'react';
import { createComponent } from '../core';
import { CloseIcon } from '../assets';
import { SvgIcon } from './SvgIcon';

export const CloseButton = createComponent('button', {
  displayName: 'CloseButton',
  defaultProps: {
    children: (
      <SvgIcon
        aria-hidden
        icon={CloseIcon}
        styles={{ width: '1em', height: '1em' }}
      />
    ),
    type: 'button',
  },
  styles: {
    appearance: 'none',
    border: 'none',
    borderRadius: 'controlBorderRadius',
    backgroundColor: 'transparent',
    color: 'currentColor',
    cursor: 'pointer',
    fontSize: 0,
    lineHeight: '1rem',
    outline: 'none',
    m: 0,
    p: 1,
    '&:focus': {
      backgroundColor: 'accent',
      color: 'accentText',
    },
    '&:hover': {
      backgroundColor: 'accent',
      color: 'accentText',
    },
    '&:active': {
      backgroundColor: 'accent',
      color: 'accentText',
    },
  },
});
