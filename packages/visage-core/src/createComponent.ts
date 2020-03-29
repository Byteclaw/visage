import { omitProps, OmitPropsSetting } from '@byteclaw/visage-utils';
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

const DEFAULT_PROPS = {};
const DEFAULT_STYLE_SHEET = {};

export function createComponent<
  TDefaultComponent extends ComponentConstraint,
  TVariants extends {}[] = {}[]
>(
  defaultAs: TDefaultComponent,
  {
    asMemo = true,
    defaultProps = DEFAULT_PROPS,
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
    defaultProps?: Partial<
      ExtractVisageComponentProps<TDefaultComponent> &
        UnionToIntersection<TVariants[number]>
    >;
    /**
     * This is alias for styles in options, if you specify both, only styles option is accepted
     */
    defaultStyles?:
      | StyleSheet<VisageStylingProperties>
      | StyleFunction<
          ExtractVisageComponentProps<TDefaultComponent> &
            UnionToIntersection<TVariants[number]>
        >;
    /**
     * Component's styles
     *
     * This is similar to styled.div({}) for example
     *
     * If you don't rely on props, please don't use a function to prevent unnecessary
     * styles invalidation
     */
    styles?:
      | StyleSheet<VisageStylingProperties>
      | StyleFunction<
          ExtractVisageComponentProps<TDefaultComponent> &
            UnionToIntersection<TVariants[number]>
        >;
    /**
     * Component variant prop processors, these are used to tell the component
     * which variant props should be stripped and work as a syntactic sugar to get types
     * for variants in typescript
     */
    variants?: TVariants;
  } = {},
): VisageComponent<
  ExtractVisageComponentProps<TDefaultComponent> &
    UnionToIntersection<TVariants[number]>
> {
  const componentName = displayName(name || defaultAs);
  const faceStyleSheet = { face: componentName };
  const componentOptions: UseVisageHookOptions = {
    componentName,
    defaultStyles: styles || defaultStyles || DEFAULT_STYLE_SHEET,
    faceStyleSheet,
    omitProps:
      variants && variants.length > 0
        ? props => omitProps(props, (variants as any) as OmitPropsSetting[])
        : props => props,
  };
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
        ...defaultProps,
        ...restProps,
        children: restProps.children || (defaultProps as any).children,
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
