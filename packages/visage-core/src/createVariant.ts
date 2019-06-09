import React from 'react';
import { ComponentConstraint, StyleSheet } from './types';
import { extendStyleSheet, displayName } from './utils';

export function createVariant<
  TPropName extends keyof any,
  TVariantStyles extends {
    default: StyleSheet<any>;
    [variantName: string]: StyleSheet<any>;
  }
>(
  Component: ComponentConstraint,
  propName: TPropName,
  variantStyles: TVariantStyles,
  defaultValue: keyof TVariantStyles | 'default' = 'default',
): any {
  const Comp = React.forwardRef((props: any, ref: any) => {
    const styles = React.useMemo(
      () =>
        extendStyleSheet(
          variantStyles[(props[propName] as any) || defaultValue],
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

  Comp.displayName = `VariantedComponent(${displayName(Component)})`;

  return Comp;
}
