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
    lineHeight: 0,
    outline: 'none',
    my: -1,
    ml: 1,
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
    <SvgIcon aria-hidden focusable={false} icon={CloseIcon} />
  </Button>
)) as any;
