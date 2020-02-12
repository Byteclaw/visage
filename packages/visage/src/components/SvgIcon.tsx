import { markAsVisageComponent, VisageComponent } from '@byteclaw/visage-core';
import React, {
  ComponentProps,
  cloneElement,
  ReactElement,
  JSXElementConstructor,
  isValidElement,
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
      {isValidElement(Icon) ? (
        cloneElement(Icon, iconProps)
      ) : (
        <Icon {...iconProps} />
      )}
    </SvgIconBase>
  );
};

markAsVisageComponent(SvgIcon);
