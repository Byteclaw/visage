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

type HTMLELProps<
  TElement extends keyof JSX.IntrinsicElements,
  TComponentProps extends {}
> = { as: TElement } & JSX.IntrinsicElements[TElement] &
  TComponentProps &
  StyleProps &
  React.RefAttributes<any>;

export interface VisageComponent<TComponentProps extends {}> {
  displayName?: string;

  // as component
  <P>(
    props: { as: React.ComponentType<P> } & P &
      TComponentProps &
      StyleProps &
      React.RefAttributes<any>,
  ): React.ReactElement | null;

  // HTML
  (props: HTMLELProps<'a', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'abbr', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'address', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'area', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'article', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'aside', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'audio', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'b', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'base', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'bdi', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'bdo', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'big', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'blockquote', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'body', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'br', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'button', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'canvas', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'caption', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'cite', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'code', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'col', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'colgroup', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'data', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'datalist', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'dd', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'del', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'details', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'dfn', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'dialog', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'div', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'dl', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'dt', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'em', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'embed', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'fieldset', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'figcaption', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'figure', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'footer', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'form', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'h1', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'h2', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'h3', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'h4', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'h5', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'h6', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'head', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'header', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'hgroup', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'hr', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'html', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'i', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'iframe', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'img', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'input', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'ins', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'kbd', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'keygen', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'label', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'legend', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'li', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'link', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'main', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'map', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'mark', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'menu', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'menuitem', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'meta', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'meter', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'nav', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'noindex', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'noscript', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'object', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'ol', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'optgroup', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'option', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'output', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'p', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'param', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'picture', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'pre', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'progress', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'q', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'rp', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'rt', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'ruby', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'s', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'samp', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'script', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'section', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'select', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'small', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'source', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'span', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'strong', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'style', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'sub', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'summary', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'sup', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'table', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'template', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'tbody', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'td', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'textarea', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'tfoot', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'th', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'thead', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'time', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'title', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'tr', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'track', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'u', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'ul', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'var', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'video', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'wbr', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'webview', TComponentProps>): React.ReactElement | null;

  // SVG
  (props: HTMLELProps<'svg', TComponentProps>): React.ReactElement | null;

  (props: HTMLELProps<'animate', TComponentProps>): React.ReactElement | null; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
  (
    props: HTMLELProps<'animateMotion', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'animateTransform', TComponentProps>,
  ): React.ReactElement | null; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
  (props: HTMLELProps<'circle', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'clipPath', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'defs', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'desc', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'ellipse', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'feBlend', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'feColorMatrix', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feComponentTransfer', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feComposite', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feConvolveMatrix', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feDiffuseLighting', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feDisplacementMap', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feDistantLight', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feDropShadow', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'feFlood', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'feFuncA', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'feFuncB', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'feFuncG', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'feFuncR', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'feGaussianBlur', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'feImage', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'feMerge', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'feMergeNode', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feMorphology', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'feOffset', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'fePointLight', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feSpecularLighting', TComponentProps>,
  ): React.ReactElement | null;
  (
    props: HTMLELProps<'feSpotLight', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'feTile', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'feTurbulence', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'filter', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'foreignObject', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'g', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'image', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'line', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'linearGradient', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'marker', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'mask', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'metadata', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'mpath', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'path', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'pattern', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'polygon', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'polyline', TComponentProps>): React.ReactElement | null;
  (
    props: HTMLELProps<'radialGradient', TComponentProps>,
  ): React.ReactElement | null;
  (props: HTMLELProps<'rect', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'stop', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'switch', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'symbol', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'text', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'textPath', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'tspan', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'use', TComponentProps>): React.ReactElement | null;
  (props: HTMLELProps<'view', TComponentProps>): React.ReactElement | null;

  // without as
  (props: TComponentProps & StyleProps): React.ReactElement | null;
}

export type ExtractArgs<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : never;

export type ExtractReturn<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;

export type ExtractThemeSettingsFromTheme<
  TTheme extends any
> = TTheme extends Theme<infer A> ? A : {};

export interface Theme<
  TThemeSettings extends StyleSheetThemeSettings = StyleSheetThemeSettings
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

export type ExtractVisageComponentProps<
  T extends ComponentConstraint
> = T extends VisageComponent<infer P>
  ? P & StyleProps
  : ComponentProps<T> & StyleProps;

export type OmittableProps<T extends {}> = {
  [K in keyof T]?: undefined | T[K];
};

export interface StyleFunction<TProps extends {}> {
  (props: TProps): StyleSheet;
}

export type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : {};
