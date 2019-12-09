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
      prop: string;
      name: string;
      stripProp: boolean;
      defaultValue: string | boolean;
    }[];
  } = {},
): VisageComponent<{}, any> {
  const componentName = displayName(name || defaultAs);
  const componentRenderer = (
    { as = defaultAs, ...restProps }: StyleProps & { as: any },
    ref: any,
  ) => {
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
  };

  componentRenderer.displayName = `VisageComponent(${componentName})`;

  return markAsVisageComponent(React.forwardRef(componentRenderer) as any);
}
