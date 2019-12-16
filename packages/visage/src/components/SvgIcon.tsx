import { markAsVisageComponent, VisageComponent } from '@byteclaw/visage-core';
import React, {
  ComponentProps,
  cloneElement,
  ReactElement,
  JSXElementConstructor,
} from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../types';

const SvgIconBase = createComponent('div', {
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
});

export const SvgIcon: VisageComponent<
  {
    icon: ReactElement | JSXElementConstructor<any>;
    iconProps?: JSX.IntrinsicElements['svg'];
  } & ComponentProps<typeof SvgIconBase>,
  StyleProps
> = function SvgIcon({ icon: Icon, iconProps, ...restProps }: any) {
  return (
    <SvgIconBase {...restProps}>
      {typeof Icon === 'function' ? (
        <Icon {...iconProps} />
      ) : iconProps ? (
        cloneElement(Icon, iconProps)
      ) : (
        Icon
      )}
    </SvgIconBase>
  );
};

markAsVisageComponent(SvgIcon);
