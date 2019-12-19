import React, { ComponentProps } from 'react';
import { Theme } from './theme';

export interface Visage<TTheme extends Theme> {
  /**
   * Current responsive breakpoint
   */
  breakpoint: number;
  /**
   * Returns a face by component name
   */
  face(componentName: string): StyleSheet<any>;
  /**
   * Generates a style representation for a style sheet
   *
   * For example:
   * In case of css it returns className prop
   * In case of react-nativr it should return styles prop
   */
  generate(styleSheet: StyleSheet<any>): { [prop: string]: any };
  /**
   * Resolves style prop value to final value
   *
   * For example fontSize 0 is resolved to some value by stylers defined in theme
   */
  resolveStyle(
    prop: string,
    value:
      | string
      | number
      | null
      | undefined
      | (string | number | null | undefined)[],
  ): string | number | null | undefined;
  /**
   * Current theme
   */
  theme: TTheme;
}

export interface ValidStyleSheet {
  [key: string]: any;
}

type MakeResponsiveStyleSheet<TStyleSheet extends ValidStyleSheet> = {
  [K in keyof TStyleSheet]:
    | TStyleSheet[K]
    | null
    | undefined
    | (string | number | null | undefined | TStyleSheet[K])[];
};

export type StyleSheet<
  TStyleSheet extends ValidStyleSheet
> = MakeResponsiveStyleSheet<TStyleSheet> & {
  [pseudo: string]:
    | string
    | number
    | null
    | undefined
    | (string | number | null | undefined)[]
    | MakeResponsiveStyleSheet<TStyleSheet>;
};

/**
 * These are the props that are being passed down the tree if you wrap one Visage component
 * with another Visage component
 *
 * For example createComponent(anotherVisageComponent) or `<VisageComponent as={AnotherVisageComponent} />`
 */
export interface StyleProps<TStyleSheet extends ValidStyleSheet = {}> {
  styles?: StyleSheet<TStyleSheet>;
  parentStyles?: StyleSheet<TStyleSheet>;
}

/**
 * Style generator is responsible for converting style sheet from component to final styles representation
 * For example to css style sheet and returns a className prop
 * Or in case of react-native StyleSheet object and returns it in styles prop
 */
export interface StyleGenerator<TTheme extends Theme = Theme> {
  (styleSheet: StyleSheet<any>, breakpoint: number, theme: TTheme): {
    /** Output prop name that references generated style e.g. className, styles, etc */
    [prop: string]: any;
  };
}

export interface ResolvedStyleSheet {
  [propOrPseudo: string]:
    | string
    | null
    | undefined
    | number
    | {
        [prop: string]: string | null | undefined | number;
      };
}

export type ComponentConstraint =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type ExtractVisageComponentProps<
  T extends ComponentConstraint
> = T extends VisageComponent<infer P, infer S>
  ? P & StyleProps<S>
  : ComponentProps<T>;

export type OmittableProps<T extends {}> = {
  [K in keyof T]?: undefined | T[K];
};

export interface VisageComponent<
  TComponentProps,
  TStyleSheet extends ValidStyleSheet
> {
  displayName?: string;
  <
    C extends ComponentConstraint,
    P = C extends ComponentConstraint ? ExtractVisageComponentProps<C> : {}
  >(
    props: { as?: C } & StyleProps<TStyleSheet> & TComponentProps & P,
  ): React.ReactElement | null;
}

export interface StyleFunction<
  TProps extends {},
  TStyleSheet extends ValidStyleSheet
> {
  (
    props: TProps,
    styleOverrides?: StyleSheet<TStyleSheet>,
    parentStyles?: StyleSheet<TStyleSheet>,
  ): StyleSheet<TStyleSheet>;
}

type TEmptyObjectType = {};

type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : TEmptyObjectType;

export interface ComponentFactory<TStyleSheet extends ValidStyleSheet> {
  <
    TDefaultComponent extends ComponentConstraint,
    TVariantsProps extends any[] | undefined = undefined,
    TProps extends {} = ExtractVisageComponentProps<TDefaultComponent> &
      (TVariantsProps extends Array<infer P>
        ? UnionToIntersection<P>
        : TEmptyObjectType),
    TDefaultProps extends {} = Partial<TProps>
  >(
    as: TDefaultComponent,
    options?: {
      displayName?: string;
      defaultProps?: TDefaultProps;
      defaultStyles?:
        | StyleSheet<TStyleSheet>
        | StyleFunction<TProps, TStyleSheet>;
      variants?: TVariantsProps;
    },
  ): VisageComponent<TProps, TStyleSheet>;
}

export interface UseDesignSystemHookOptions<TTheme extends Theme = Theme> {
  is?: number;
  faces?: { [componenName: string]: undefined | StyleSheet<any> };
  styleGenerator: StyleGenerator<TTheme>;
  theme: TTheme;
}

export interface UseDesignSystemHook<TTheme extends Theme = Theme> {
  (options?: UseDesignSystemHookOptions<TTheme>): Visage<TTheme>;
}

export interface UseVisageHookOptions<TStyleSheet extends ValidStyleSheet> {
  as: any;
  componentName: string;
  defaultStyles?: StyleSheet<TStyleSheet> | StyleFunction<any, TStyleSheet>;
  variants?: {
    prop: string;
    name: string;
    stripProp: boolean;
    defaultValue: string | boolean;
  }[];
}

export interface UseVisageHook<
  TStyleSheet extends ValidStyleSheet,
  TOutputProps extends { [prop: string]: any } = { [prop: string]: any }
> {
  (
    props: StyleProps<TStyleSheet>,
    options: UseVisageHookOptions<TStyleSheet>,
  ): TOutputProps;
}
