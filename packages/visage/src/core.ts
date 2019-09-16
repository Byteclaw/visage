import {
  BooleanVariantCreator,
  ComponentFactory,
  StyleSheet,
  VariantedComponentCreator,
  createComponent as baseCreateComponent,
  displayName,
  isVisageComponent,
  markAsVisageComponent,
  useMemoizedCall,
} from '@byteclaw/visage-core';
import { depthFirstObjectMerge } from '@byteclaw/visage-utils';
import React from 'react';
import { StyleProps } from './createNPointTheme';
import { EmotionStyleSheet } from './types';

export const createComponent: ComponentFactory<
  StyleProps
> = baseCreateComponent;

function combineVariantedStyleSheet(
  styleSheet: any,
  parentStyles: any,
  customStyles: any,
) {
  return Object.keys(styleSheet).reduce(
    (customizedVariants, variantName) => ({
      ...customizedVariants,
      [variantName]: depthFirstObjectMerge<EmotionStyleSheet>(
        customizedVariants[variantName],
        parentStyles || {},
        customStyles || {},
      ),
    }),
    styleSheet,
  );
}

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
      const styles = useMemoizedCall(
        combineVariantedStyleSheet,
        styleSheet,
        parentStyles,
        customStyles,
      );

      return React.createElement(C, {
        ...rest,
        [variantPropName]: variant || defaultValue,
        parentStyles: styles,
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
        const styles = useMemoizedCall(
          combineVariantedStyleSheet,
          styleSheet,
          parentStyles,
          customStyles,
        );

        return React.createElement(
          C,
          stripProp
            ? {
                ...rest,
                [variantPropName]: variant ? variant.toString() : 'false',
                parentStyles: styles,
                ref,
              }
            : {
                ...rest,
                [variantPropName]: variant ? variant.toString() : 'false',
                [propName]: variant,
                parentStyles: styles,
                ref,
              },
        );
      },
    );

    Comp.displayName = `BooleanVariantedComponent(${displayName(Component)})`;
    markAsVisageComponent(Comp);

    return Comp;
  };
};
