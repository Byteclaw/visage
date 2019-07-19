import {
  BooleanVariantCreator,
  ComponentFactory,
  VariantedComponentCreator,
  createComponent as baseCreateComponent,
  displayName,
  StyleSheet,
} from '@byteclaw/visage-core';
import React from 'react';
import { StyleProps } from './createNPointTheme';

export const createComponent: ComponentFactory<
  StyleProps
> = baseCreateComponent;

export const createVariant: VariantedComponentCreator<StyleProps> = (
  Component: any,
  propName: string,
  variantStyles: any,
  defaultValue: any = 'default',
) => {
  const variantPropName = `data-${propName.toLowerCase()}`;
  const styleSheet: { [key: string]: StyleSheet<any> } = Object.keys(
    variantStyles,
  ).reduce((res, variantName) => {
    return {
      ...res,
      [`&[${variantPropName}="${variantName}"]`]: variantStyles[variantName],
    };
  }, {});

  const Comp = React.forwardRef(
    ({ [propName]: variant, styles: customStyles, ...rest }: any, ref: any) => {
      // constructs object with &[data-variant="variantName"] from variantStyles
      const styles = React.useMemo(
        () =>
          customStyles
            ? Object.keys(styleSheet).reduce(
                (customizedVariants, variantName) => ({
                  ...customizedVariants,
                  [variantName]: {
                    ...customizedVariants[variantName],
                    ...customStyles,
                  },
                }),
                styleSheet,
              )
            : styleSheet,
        [customStyles, styleSheet],
      );

      return React.createElement(Component, {
        ...rest,
        [variantPropName]: variant || defaultValue,
        styles,
        ref,
      });
    },
  );

  Comp.displayName = `VariantedComponent(${displayName(Component)})`;

  return Comp;
};

export const createBooleanVariant: BooleanVariantCreator<StyleProps> = (
  propName: any,
  {
    onStyles,
    offStyles,
    stripProp = true,
  }: {
    onStyles: StyleSheet<any>;
    offStyles?: StyleSheet<any>;
    stripProp?: boolean;
  },
) => {
  const variantPropName = `data-${propName.toLowerCase()}`;
  const styleSheet = {
    [`&[${variantPropName}="true"]`]: onStyles,
    [`&[${variantPropName}="false"]`]: offStyles || {},
  };

  return function booleanVariantCreator(Component: any) {
    const Comp = React.forwardRef(
      (
        { [propName]: variant, styles: customStyles, ...rest }: any,
        ref: any,
      ) => {
        const styles = React.useMemo(
          () =>
            customStyles
              ? Object.keys(styleSheet).reduce(
                  (customizedVariants, variantName) => ({
                    ...customizedVariants,
                    [variantName]: {
                      ...customizedVariants[variantName],
                      ...customStyles,
                    },
                  }),
                  styleSheet,
                )
              : styleSheet,
          [customStyles, styleSheet],
        );

        return React.createElement(Component, {
          ...rest,
          [variantPropName]: variant ? variant.toString() : 'false',
          [propName]: stripProp ? undefined : variant,
          styles,
          ref,
        });
      },
    );

    Comp.displayName = `BooleanVariantedComponent(${displayName(Component)})`;

    return Comp;
  };
};
