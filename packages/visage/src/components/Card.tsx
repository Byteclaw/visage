import React, { ReactElement, ReactNode, forwardRef } from 'react';
import {
  VisageComponent,
  markAsVisageComponent,
  ExtractVisageComponentProps,
} from '@byteclaw/visage-core';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';
import { StyleProps } from '../types';

const CardBase = createComponent('div', {
  displayName: 'Card',
  defaultStyles: props => ({
    boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
    p: 1,
    position: 'relative',
    ...(props.touchable
      ? {
          cursor: 'pointer',
          '&:focus-within, &:focus, &:hover': {
            boxShadow:
              '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.40)',
          },
          '&:active': {
            boxShadow:
              '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
          },
        }
      : {}),
  }),
  variants: [booleanVariant('touchable', true)],
});

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
    '& a, & button, & input, & select, & [role="button"], & [role="checkbox"], & [role="radio"], & [role="combobox"], & [role="listbox"], & [role="search"], & [role="switch"], & [role="textbox"]': {
      position: 'relative',
      zIndex: 0,
    },
    width: '100%',
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
> = forwardRef(
  (
    {
      children,
      contentProps,
      touchable,
      touchableProps,
      ...restProps
    }: CardProps,
    ref: any,
  ) => (
    <CardBase touchable={!!touchable} ref={ref} {...restProps}>
      {touchable ? (
        <CardTouchable {...touchableProps}>{touchable}</CardTouchable>
      ) : null}
      <CardContent {...contentProps}>{children}</CardContent>
    </CardBase>
  ),
) as any;

markAsVisageComponent(Card);
