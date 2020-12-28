import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
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

type SvgIconBaseProps = ExtractVisageComponentProps<typeof SvgIconBase>;

interface SvgIconProps extends SvgIconBaseProps {
  icon: ReactElement | JSXElementConstructor<any>;
  iconProps?: JSX.IntrinsicElements['svg'];
}

export const SvgIcon = markAsVisageComponent(function SvgIcon({
  icon: Icon,
  iconProps,
  ...restProps
}: SvgIconProps) {
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
});
