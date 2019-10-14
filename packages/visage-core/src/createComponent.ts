import React from 'react';
import { useVisage } from './hooks';
import { displayName, markAsVisageComponent } from './utils';
import { StyleProps, ComponentConstraint, VisageComponent } from './types';

export function createComponent(
  defaultAs: ComponentConstraint,
  {
    defaultProps,
    defaultStyles,
    displayName: name,
    variants,
  }: {
    defaultProps?: any;
    defaultStyles?: any;
    displayName?: string;
    variants?: {
      name: string;
      stripProp: boolean;
      defaultValue: string | boolean;
    }[];
  } = {},
): VisageComponent<{}, any> {
  const componentName = displayName(name || defaultAs);
  const Component: any = React.forwardRef(
    ({ as = defaultAs, ...restProps }: StyleProps, ref) => {
      const props = useVisage(
        {
          ...defaultProps,
          ...restProps,
        },
        {
          as,
          componentName,
          defaultStyles,
          variants,
        },
      );

      return React.createElement(as, {
        ...props,
        ref,
      });
    },
  ) as any;

  Component.displayName = `VisageComponent(${componentName})`;
  markAsVisageComponent(Component);

  return Component;
}
