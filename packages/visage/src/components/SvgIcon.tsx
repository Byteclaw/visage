import { markAsVisageComponent, VisageComponent } from '@byteclaw/visage-core';
import React, { cloneElement, ReactElement, FunctionComponent } from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';

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
    icon: ReactElement | FunctionComponent<any>;
    iconProps?: JSX.IntrinsicElements['svg'];
  },
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
