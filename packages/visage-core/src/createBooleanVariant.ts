import React from 'react';
import { ComponentConstraint, StyleSheet } from './types';
import { extendStyleSheet, displayName } from './utils';

export function createBooleanVariant<TPropName extends keyof any>(
  propName: TPropName,
  onStyles: StyleSheet<any>,
  offStyles: StyleSheet<any> = {},
) {
  return function booleanVariantCreator(Component: ComponentConstraint) {
    const Comp = React.forwardRef((props: any, ref: any) => {
      const styles = React.useMemo(
        () =>
          extendStyleSheet(
            props[propName] ? onStyles : offStyles,
            props.styles,
          ),
        [props[propName], props.styles],
      );
      const restProps: { [key: string]: any } = {};
      const propsKeys = Object.keys(props);
      const propsKeysLength = propsKeys.length;

      for (let i = 0; i < propsKeysLength; i++) {
        const key = propsKeys[i];

        if (key === propName) continue;

        restProps[key] = props[key];
      }

      return React.createElement(Component, {
        ...restProps,
        styles,
        ref,
      });
    });

    Comp.displayName = `BooleanVariantedComponent(${displayName(Component)})`;

    return Comp;
  };
}
