import React, { MouseEventHandler, Ref } from 'react';
import { VisageComponent } from '@byteclaw/visage-core';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';

interface BackdropProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  open: boolean;
}

const BaseBackdrop = createComponent('div', {
  displayName: 'BaseBackdrop',
  defaultStyles: {
    backgroundColor: 'transparent',
    position: 'fixed',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
  },
});

export const Backdrop: VisageComponent<
  BackdropProps,
  StyleProps
> = React.forwardRef(function Backdrop(
  props: BackdropProps,
  ref: Ref<HTMLDivElement>,
) {
  const { open, ...rest } = props;

  return open ? <BaseBackdrop aria-hidden ref={ref} {...rest} /> : null;
});
