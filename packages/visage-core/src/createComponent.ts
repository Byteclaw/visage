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
import { useVisage } from './useVisage';

interface CreateComponentOptions<
  TProps extends {},
  TVariantsProps extends any[] | undefined = undefined,
  TDefaultProps extends {} = Partial<TProps>
> {
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
  defaultStyles?: StyleSheet<VisageStylingProperties> | StyleFunction<TProps>;
  /**
   * Component's styles
   *
   * This is similar to styled.div({}) for example
   *
   * If you don't rely on props, please don't use a function to prevent unnecessary
   * styles invalidation
   */
  styles?: StyleSheet<VisageStylingProperties> | StyleFunction<TProps>;
  /**
   * Component variant prop processors, these are used to tell the component
   * which variant props should be stripped and work as a syntactic sugar to get types
   * for variants in typescript
   */
  variants?: TVariantsProps;
}

/**
 * Purpose of component factory type is to override createComponent in packages
 * that have their own styles objects
 */
export interface ComponentFactory {
  <
    TDefaultComponent extends ComponentConstraint,
    TVariantsProps extends any[] | undefined = undefined,
    TProps extends {} = ExtractVisageComponentProps<TDefaultComponent> &
      (TVariantsProps extends Array<infer P> ? UnionToIntersection<P> : {}),
    TDefaultProps extends {} = Partial<TProps>
  >(
    as: TDefaultComponent,
    options?: CreateComponentOptions<TProps, TVariantsProps, TDefaultProps>,
  ): VisageComponent<TProps>;
}

const DEFAULT_PROPS = {};

export function createComponent(
  defaultAs: ComponentConstraint,
  {
    asMemo = true,
    defaultProps = DEFAULT_PROPS,
    defaultStyles,
    styles,
    displayName: name,
    variants,
  }: {
    asMemo?: boolean;
    defaultProps?: any;
    defaultStyles?: any;
    displayName?: string;
    styles?: any;
    variants?: {
      prop: string;
      name: string;
      stripProp: boolean;
      defaultValue: string | boolean;
    }[];
  } = {},
): VisageComponent<{}> {
  const componentName = displayName(name || defaultAs);
  const RawComponent = (
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
        defaultStyles: styles || defaultStyles,
        variants,
      },
    );

    return React.createElement(as, {
      ...props,
      ref,
    });
  };

  RawComponent.displayName = `VisageComponent(${componentName})`;

  // @TODO check if ref is passed correctly in both cases
  const ComponentWithForwardRef = React.forwardRef(RawComponent);
  const Component = markAsVisageComponent(
    asMemo ? React.memo(ComponentWithForwardRef) : ComponentWithForwardRef,
  );
  Component.displayName = RawComponent.displayName;

  return Component as any;
}
