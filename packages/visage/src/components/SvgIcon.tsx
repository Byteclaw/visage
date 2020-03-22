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

const SvgIconBase = createComponent('div', {
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
    },
  },
});

export const SvgIcon: VisageComponent<{
  icon: ReactElement | JSXElementConstructor<any>;
  iconProps?: JSX.IntrinsicElements['svg'];
} & ExtractVisageComponentProps<typeof SvgIconBase>> = function SvgIcon({
  icon: Icon,
  iconProps,
  ...restProps
}: any) {
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
