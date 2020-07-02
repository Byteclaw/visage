import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, {
  cloneElement,
  ReactElement,
  JSXElementConstructor,
  isValidElement,
} from 'react';
import { createComponent } from '../core';

const SvgIconBase = createComponent('span', {
  displayName: 'SvgIconBase',
  styles: {
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
      width: 'auto',
      '@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)': {
        // this is dumb, but we expect icons to be squares in IE11
        width: '1em',
      },
    },
  },
});

export const SvgIcon: VisageComponent<
  {
    icon: ReactElement | JSXElementConstructor<any>;
    iconProps?: JSX.IntrinsicElements['svg'];
  } & ExtractVisageComponentProps<typeof SvgIconBase>
> = function SvgIcon({ icon: Icon, iconProps, ...restProps }: any) {
  const svgProps = {
    focusable: false,
    height: null,
    width: null,
    ...iconProps,
  };

  return (
    <SvgIconBase {...restProps}>
      {isValidElement(Icon) ? (
        cloneElement(Icon, svgProps)
      ) : (
        <Icon {...svgProps} />
      )}
    </SvgIconBase>
  );
};

markAsVisageComponent(SvgIcon);
