import React, { ReactElement, ReactNode, forwardRef } from 'react';
import {
  VisageComponent,
  markAsVisageComponent,
  ExtractVisageComponentProps,
} from '@byteclaw/visage-core';
import { createBooleanVariant, createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';

const CardBase = createBooleanVariant('clickable', {
  onStyles: {
    cursor: 'pointer',
    '&:focus-within, &:focus, &:hover': {
      boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.40)',
    },
    '&:active': {
      boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
    },
  },
  stripProp: true,
})(
  createComponent('div', {
    displayName: 'Card',
    defaultStyles: {
      boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
      p: 1,
      position: 'relative',
    },
  }),
);
const CardTouchable = createComponent('div', {
  displayName: 'CardTouchable',
  defaultStyles: {
    bottom: 0,
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    '& > *': {
      cursor: 'inherit',
      display: 'block',
      height: '100%',
      maxHeight: '100%',
      maxWidth: '100%',
      width: '100%',
    },
    zIndex: 0,
  },
});
const CardContent = createComponent('div', {
  displayName: 'CardContent',
  defaultStyles: {
    '& a, & button, & input, & select, &[role="button"], &[role="checkbox"], &[role="radio"], &[role="combobox"], &[role="listbox"], &[role="search"], &[role="switch"], &[role="textbox"]': {
      position: 'relative',
      width: '100%',
      zIndex: 0,
    },
  },
});

interface CardProps {
  contentProps?: ExtractVisageComponentProps<typeof CardContent>;
  touchableProps?: ExtractVisageComponentProps<typeof CardTouchable>;
  children?: ReactNode;
  touchable?: ReactElement;
}

export const Card: VisageComponent<
  CardProps & ExtractVisageComponentProps<typeof CardBase>,
  StyleProps
> = forwardRef(({ children, touchable, ...restProps }: CardProps, ref: any) => (
  <CardBase clickable={!!touchable} ref={ref} {...restProps}>
    {touchable ? <CardTouchable>{touchable}</CardTouchable> : null}
    <CardContent>{children}</CardContent>
  </CardBase>
)) as any;

markAsVisageComponent(Card);
