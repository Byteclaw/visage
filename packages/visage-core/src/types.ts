import React, { ComponentProps } from 'react';
import { OmitPropsSetting } from '@byteclaw/visage-utils/src';
import { StyleSheetCache } from './cache';
import {
  ResolvedStyleSheet,
  StyleSheet,
  StylerSheetResolveContext,
  StylerFunction,
  StyleValueFormatter,
  StyleValueResolver,
  StyleSheetThemeSettings,
} from './styleSheet';

declare global {
  /**
   * This hould be augmented in libraries that consume the core so you can
   * easily add autocomplete and typecheck for styles properties
   */
  export interface VisageStylingProperties {}

  /**
   * This should be augmented in libraries that consume the core so you can
   * easily add autocomplete and typecheck for your properties
   */
  export interface VisageStyleSheet {}
}

export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
> = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithRef<C>>;

type AsProp<C extends React.ElementType> = {
  as?: C;
};

export type ExtendableProps<ExtendedProps = {}, OverrideProps = {}> =
  OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;

export type InheritableElementProps<C extends React.ElementType, Props = {}> =
  ExtendableProps<PropsOf<C>, Props>;

export type PolymorphicComponentProps<C extends React.ElementType, Props = {}> =
  InheritableElementProps<C, Props & StyleProps & AsProp<C>>;

export interface VisageComponent<
  TComponentProps extends { [key: string]: any },
> {
  displayName?: string;

  <C extends React.ElementType>(
    props: PolymorphicComponentProps<C, TComponentProps>,
  ): React.ReactElement | null;
}

export type ExtractThemeSettingsFromTheme<TTheme extends any> =
  TTheme extends Theme<infer A> ? A : { [key: string]: any };

export interface Theme<
  TThemeSettings extends StyleSheetThemeSettings = StyleSheetThemeSettings,
> {
  readonly formatters: {
    [name: string]: StyleValueFormatter;
  };
  readonly resolvers: {
    color: StyleValueResolver;
    themeKey: StyleValueResolver;
    [name: string]: StyleValueResolver;
  };
  readonly stylers: {
    catchAll: StylerFunction;
    extends: StylerFunction;
    face: StylerFunction;
    [name: string]: StylerFunction;
  };
  readonly format: StyleValueFormatter;
  /**
   * Resolves a style prop name to a final output that will be processed by style applier
   */
  readonly resolve: StyleValueResolver;
  readonly style: StylerFunction;
  theme: TThemeSettings;
}

export interface Visage<TTheme extends Theme> {
  /**
   * Current responsive breakpoint
   */
  breakpoint: number;
  ctx: StylerSheetResolveContext<ExtractThemeSettingsFromTheme<TTheme>>;
  /**
   * Generates a style representation for style sheets
   *
   * Styles sheets are merged from left to right
   * meaning that subsequent style sheet is merged to
   * previous one
   *
   * For example:
   * In case of css it returns className prop
   * In case of react-nativr it should return styles prop
   */
  generate(styleSheets: StyleSheet[]): { [prop: string]: any };
  /**
   * Resolves style sheets
   *
   * This operation is almost the same as generate except it returns resolved stylesheet
   * and not style props
   */
  resolveStyleSheets(styleSheets: StyleSheet[]): ResolvedStyleSheet;
  /**
   * Current style sheet cache
   *
   * Cache is nested because stylesheets are dependent on different style sheets
   */
  styleSheetCache: StyleSheetCache;
  /**
   * Current theme
   */
  theme: ExtractThemeSettingsFromTheme<TTheme>;
}
/**
 * These are the props that are being passed down the tree if you wrap one Visage component
 * with another Visage component
 *
 * For example createComponent(anotherVisageComponent) or `<VisageComponent as={AnotherVisageComponent} />`
 */
export interface StyleProps {
  /**
   * Style overrides
   */
  styles?: StyleSheet;
  /**
   * Parent styles are array of all stylesheets that should be applied from parents
   */
  parentStyles?: StyleSheet[];
  /**
   * All variant processing functions
   */
  $$variants?: OmitPropsSetting[];
}

/**
 * Style generator is responsible for converting style sheet from component to final styles representation
 * For example to css style sheet and returns a className prop
 * Or in case of react-native StyleSheet object and returns it in styles prop
 */
export interface StyleGenerator {
  (styleSheets: StyleSheet[], ctx: StylerSheetResolveContext<any>): {
    /** Output prop name that references generated style e.g. className, styles, etc */
    [prop: string]: any;
  };
}

export type ComponentConstraint =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type ExtractVisageComponentProps<T extends ComponentConstraint> =
  T extends VisageComponent<infer P>
    ? P & StyleProps
    : ComponentProps<T> & StyleProps;

export type OmittableProps<T extends { [key: string]: any }> = {
  [K in keyof T]?: undefined | T[K];
};

export interface StyleFunction<TProps extends { [key: string]: any }> {
  (props: TProps): StyleSheet;
}

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
