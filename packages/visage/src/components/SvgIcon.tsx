import { markAsVisageComponent, VisageComponent } from '@byteclaw/visage-core';
import React, { ReactElement, FunctionComponent } from 'react';
import { createComponent, createVariant } from '../core';
import { StyleProps } from '../createNPointTheme';

const SvgIconBase = createVariant(
  createComponent('div', {
    displayName: 'SvgIconBase',
    defaultStyles: {
      alignItems: 'center',
      display: 'inline-flex',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      '&::before': {
        // respect line height
        content: '"\\200b"',
      },
      '& svg': {
        height: '1em',
        verticalAlign: 'middle',
      },
    },
  }),
  'variant',
  {
    stroked: {
      '& path:last-child': {
        fill: 'transparent',
        stroke: 'bodyText',
      },
    },
    default: {
      '& path:last-child': {
        fill: 'bodyText',
        stroke: 'transparent',
      },
    },
  },
);

export const SvgIcon: VisageComponent<
  { icon: ReactElement | FunctionComponent<any>; variant?: 'stroked' },
  StyleProps
> = function SvgIcon({ icon: Icon, ...restProps }: any) {
  return (
    <SvgIconBase {...restProps}>
      {typeof Icon === 'function' ? <Icon /> : Icon}
    </SvgIconBase>
  );
};

markAsVisageComponent(SvgIcon);
