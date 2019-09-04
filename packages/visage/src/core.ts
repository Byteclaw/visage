import {
  BooleanVariantCreator,
  ComponentFactory,
  VariantedComponentCreator,
  createComponent as baseCreateComponent,
  displayName,
  isVisageComponent,
  markAsVisageComponent,
  StyleSheet,
} from '@byteclaw/visage-core';
import { depthFirstObjectMerge } from '@byteclaw/visage-utils';
import React from 'react';
import { StyleProps } from './createNPointTheme';

export type EmotionStyleSheet = StyleSheet<StyleProps>;

export const createComponent: ComponentFactory<
  StyleProps
> = baseCreateComponent;

export const createVariant: VariantedComponentCreator<StyleProps> = (
  Component: any,
  propName: string,
  variantStyles: any,
  defaultValue: any = 'default',
) => {
  const C = !isVisageComponent(Component)
    ? createComponent(Component)
    : Component;

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
    (
      { [propName]: variant, styles: customStyles, parentStyles, ...rest }: any,
      ref: any,
    ) => {
      // constructs object with &[data-variant="variantName"] from variantStyles
      const styles = React.useMemo(
        () =>
          Object.keys(styleSheet).reduce(
            (customizedVariants, variantName) => ({
              ...customizedVariants,
              [variantName]: depthFirstObjectMerge<EmotionStyleSheet>(
                customizedVariants[variantName],
                parentStyles || {},
                customStyles || {},
              ),
            }),
            styleSheet,
          ),
        [customStyles, styleSheet, parentStyles],
      );

      return React.createElement(C, {
        ...rest,
        [variantPropName]: variant || defaultValue,
        styles,
        ref,
      });
    },
  );

  Comp.displayName = `VariantedComponent(${displayName(Component)})`;
  markAsVisageComponent(Comp);

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
    const C = !isVisageComponent(Component)
      ? createComponent(Component)
      : Component;
    const Comp = React.forwardRef(
      (
        {
          [propName]: variant,
          parentStyles,
          styles: customStyles,
          ...rest
        }: any,
        ref: any,
      ) => {
        const styles = React.useMemo(
          () =>
            Object.keys(styleSheet).reduce(
              (customizedVariants, variantName) => ({
                ...customizedVariants,
                [variantName]: depthFirstObjectMerge<EmotionStyleSheet>(
                  customizedVariants[variantName],
                  parentStyles || {},
                  customStyles || {},
                ),
              }),
              styleSheet,
            ),
          [customStyles, parentStyles, styleSheet],
        );

        return React.createElement(C, {
          ...rest,
          [variantPropName]: variant ? variant.toString() : 'false',
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
};
