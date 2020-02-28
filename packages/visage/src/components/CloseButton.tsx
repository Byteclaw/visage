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
  defaultStyles: {
    borderStyle: 'none',
    borderWidth: 0,
    borderRadius: 'controlBorderRadius',
    backgroundColor: 'transparent',
    color: 'currentColor',
    cursor: 'pointer',
    fontSize: 0,
    lineHeight: '1em',
    outline: 'none',
    my: 0,
    ml: 0,
    p: 1,
    '&:focus': {
      backgroundColor: 'lightAccent',
      color: 'lightAccentText',
    },
    '&:hover': {
      backgroundColor: 'lightAccent',
      color: 'lightAccentText',
    },
    '&:active': {
      backgroundColor: 'lightAccent',
      color: 'lightAccentText',
    },
  },
});
