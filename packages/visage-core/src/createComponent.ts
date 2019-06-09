import React from 'react';
import { VisageComponentSymbol } from './constants';
import { useVisage } from './hooks';
import { displayName } from './utils';
import { StyleProps, ComponentConstraint, VisageComponent } from './types';

export function createComponent(
  defaultAs: ComponentConstraint,
  {
    defaultStyles,
    displayName: name,
  }: { defaultStyles?: any; displayName?: string } = {},
): VisageComponent<{}, any> {
  const Component: any = React.forwardRef(
    ({ as = defaultAs, ...restProps }: StyleProps, ref) => {
      const props = useVisage(restProps, { defaultStyles, as });

      return React.createElement(as, {
        ...props,
        ref,
      });
    },
  ) as any;

  Component.displayName = `VisageComponent(${displayName(name || defaultAs)})`;
  (Component as any)[VisageComponentSymbol] = true;

  return Component;
}
