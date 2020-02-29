import React from 'react';
import { useVisage } from './hooks';
import { displayName, markAsVisageComponent } from './utils';
import { StyleProps, ComponentConstraint, VisageComponent } from './types';

const DEFAULT_PROPS = {};

export function createComponent(
  defaultAs: ComponentConstraint,
  {
    defaultProps = DEFAULT_PROPS,
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
    {
      as = defaultAs,
      ...restProps
    }: StyleProps & { as: any; [key: string]: any },
    ref: any,
  ) => {
    const props = useVisage(
      {
        ...defaultProps,
        ...restProps,
        children: restProps.children || defaultProps.children,
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
  const Component = markAsVisageComponent(
    React.forwardRef(componentRenderer) as any,
  );
  Component.displayName = componentRenderer.displayName;

  return Component;
}
