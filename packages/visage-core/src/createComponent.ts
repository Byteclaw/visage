import { OmitPropsSetting } from '@byteclaw/visage-utils';
import React from 'react';
import { displayName, markAsVisageComponent } from './utils';
import {
  StyleProps,
  ComponentConstraint,
  VisageComponent,
  UnionToIntersection,
  StyleFunction,
  ExtractVisageComponentProps,
} from './types';
import { StyleSheet } from './styleSheet';
import { useVisage, UseVisageHookOptions } from './useVisage';

const DEFAULT_STYLE_SHEET = {};

export function createComponent<
  TDefaultComponent extends ComponentConstraint,
  TVariants extends {}[] = {}[],
  TVariantIntersection = UnionToIntersection<TVariants[number]>,
  TProps extends Omit<
    ExtractVisageComponentProps<TDefaultComponent>,
    keyof TVariantIntersection
  > &
    TVariantIntersection = Omit<
    ExtractVisageComponentProps<TDefaultComponent>,
    keyof TVariantIntersection
  > &
    TVariantIntersection,
  TDefaultProps extends Partial<TProps> = {}
>(
  defaultAs: TDefaultComponent,
  {
    asMemo = true,
    defaultProps,
    defaultStyles,
    styles,
    displayName: name,
    variants,
  }: {
    /**
     * Should component be wrapped React.memo
     *
     * Default is true
     */
    asMemo?: boolean;
    /** Component's display name, if none is provided component name is inferred */
    displayName?: string;
    defaultProps?: TDefaultProps;
    /**
     * This is alias for styles in options, if you specify both, only styles option is accepted
     */
    defaultStyles?: StyleSheet | StyleFunction<TProps>;
    /**
     * Component's styles
     *
     * This is similar to styled.div({}) for example
     *
     * If you don't rely on props, please don't use a function to prevent unnecessary
     * styles invalidation
     */
    styles?: StyleSheet | StyleFunction<TProps>;
    /**
     * Component variant prop processors, these are used to tell the component
     * which variant props should be stripped and work as a syntactic sugar to get types
     * for variants in typescript
     */
    variants?: TVariants;
  } = {},
): VisageComponent<TProps> {
  const componentName = displayName(name || defaultAs);
  const faceStyleSheet = { face: componentName };
  const componentOptions: UseVisageHookOptions = {
    componentName,
    defaultStyles: styles || defaultStyles || DEFAULT_STYLE_SHEET,
    faceStyleSheet,
    variants: (variants as undefined | OmitPropsSetting[]) || [],
  };
  const defProps = defaultProps || {};
  const RawComponent = (
    {
      as = defaultAs,
      ...restProps
    }: StyleProps & { as: any; [key: string]: any },
    ref: any,
  ) => {
    const props = useVisage(
      as,
      {
        ...defProps,
        ...restProps,
        children: restProps.children || (defProps as any).children,
      },
      componentOptions,
    );

    return React.createElement(as, {
      ...props,
      ref,
    });
  };

  RawComponent.displayName = `VisageComponent(${componentName})`;

  const ComponentWithForwardRef = React.forwardRef(RawComponent);
  const Component = markAsVisageComponent(
    asMemo ? React.memo(ComponentWithForwardRef) : ComponentWithForwardRef,
  );
  Component.displayName = RawComponent.displayName;

  return Component as any;
}
