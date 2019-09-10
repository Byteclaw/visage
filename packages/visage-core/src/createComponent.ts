import React from 'react';
import { useVisage } from './hooks';
import { displayName, markAsVisageComponent } from './utils';
import { StyleProps, ComponentConstraint, VisageComponent } from './types';

export function createComponent(
  defaultAs: ComponentConstraint,
  {
    defaultStyles,
    displayName: name,
    variants,
  }: {
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
      const props = useVisage(restProps, {
        as,
        componentName,
        defaultStyles,
        variants,
      });

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
