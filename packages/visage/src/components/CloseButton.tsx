import React, { forwardRef } from 'react';
import { createComponent } from '../core';
import { CloseIcon } from '../assets';
import { SvgIcon } from './SvgIcon';

const Button = createComponent('button', {
  displayName: 'CloseButton',
  defaultStyles: {
    borderStyle: 'none',
    borderWidth: 0,
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
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    '&:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
});

export const CloseButton: typeof Button = forwardRef((props: any, ref) => (
  <Button ref={ref} type="button" {...props}>
    <SvgIcon
      aria-hidden
      focusable={false}
      icon={CloseIcon}
      styles={{ width: '1em', height: '1em' }}
    />
  </Button>
)) as any;
