import React from 'react';
import { ComponentConstraint, StyleSheet } from './types';
import { extendStyleSheet, displayName, markAsVisageComponent } from './utils';

export function createBooleanVariant<TPropName extends keyof any>(
  propName: TPropName,
  {
    onStyles,
    offStyles,
    stripProp = true,
  }: {
    stripProp: boolean;
    onStyles: StyleSheet<any>;
    offStyles: StyleSheet<any>;
  },
) {
  return function booleanVariantCreator(Component: ComponentConstraint) {
    const Comp = React.forwardRef(
      (
        { [propName]: variant, styles: customStyles, ...rest }: any,
        ref: any,
      ) => {
        const styles = React.useMemo(
          () => extendStyleSheet(variant ? onStyles : offStyles, customStyles),
          [variant, customStyles],
        );

        return React.createElement(Component, {
          ...rest,
          [propName]: stripProp ? undefined : variant,
          styles,
          ref,
        });
      },
    );

    Comp.displayName = `BooleanVariantedComponent(${displayName(Component)})`;
    markAsVisageComponent(Comp);

    return Comp;
  };
}
