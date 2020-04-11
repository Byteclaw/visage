import { LRUCache, ScaleValue } from '@byteclaw/visage-utils';

export type StyleSheetScalarValue = string | number | null | undefined;

export type StyleSheetNonObjectPropValue =
  | StyleSheetScalarValue
  | Array<StyleSheetScalarValue>;

export interface ValidStyleSheet {
  [key: string]: any;
}

interface SubStyleSheet {
  [selector: string]:
    | StyleSheetScalarValue
    | StyleSheetScalarValue[]
    | ResponsiveStyleSheet;
}

type ResponsiveStyleSheet = {
  [K in keyof VisageStylingProperties]:
    | VisageStylingProperties[K]
    | null
    | undefined
    | (StyleSheetScalarValue | VisageStylingProperties[K])[];
} &
  SubStyleSheet;

export type StyleSheet = ResponsiveStyleSheet;

/**
 * Resolved StyleSheet that will be used to generate styles
 */
export interface ResolvedStyleSheet {
  [key: string]: StyleSheetScalarValue | ResolvedStyleSheet;
}

export enum StylerResultType {
  /**
   * Pre styler that returns a StyleSheet that needs to be resolved
   * the result is then prepended to current StyleSheet which works as extend
   */
  pre = 'pre',
  /**
   * Pre styler that returns a StyleSheet that won't be resolved
   * the result is then prepended to current StyleSheet which works as extend
   */
  preFinal = 'preFinal',
  /**
   * In place styler returns a StyleSheet that needs to be resolved
   * the result is spread to current StyleSheet meaning that it works as local extend
   * but can be overwrote by subsequent props
   */
  inPlace = 'inPlace',
  /**
   * In place styler returns a StyleSheet that won't be resolved
   * the result is spread to current StyleSheet meaning that it works as local extend
   * but can be overwrote by subsequent props
   */
  inPlaceFinal = 'inPlaceFinal',
  /**
   * Post styler that returns a StyleSHeet that needs to be resolved
   * the result is then apended to current StyleSheet which works as override
   */
  post = 'post',
  /**
   * Post styler that returns a StyleSHeet that won't be resolved
   * the result is then apended to current StyleSheet which works as override
   */
  postFinal = 'postFinal',
}

export type StylerResult =
  | {
      type: StylerResultType.inPlace;
      styles: StyleSheet;
    }
  | { type: StylerResultType.post; styles: StyleSheet }
  | { type: StylerResultType.pre; styles: StyleSheet }
  | { type: StylerResultType.inPlaceFinal; styles: ResolvedStyleSheet }
  | { type: StylerResultType.preFinal; styles: ResolvedStyleSheet }
  | { type: StylerResultType.postFinal; styles: ResolvedStyleSheet };

export type StyleValueFormatter = (
  propName: string,
  value: StyleSheetScalarValue,
  ctx: StylerSheetResolveContext,
) => StyleSheetScalarValue;

export type StyleValueResolver = (
  propName: string,
  value: StyleSheetScalarValue,
  ctx: StylerSheetResolveContext,
) => StyleSheetScalarValue;

export interface StyleSheetFaces {
  [componentName: string]: StyleSheet | undefined;
}

export type StylerFunction = (
  /**
   * Prop name that is being resolved e.g. color, extends, ...
   */
  propName: string,
  /**
   * Props value, this won't be an object because object is treated
   * as nested style sheet
   */
  value: StyleSheetScalarValue,
  /**
   * Styler function context
   * Provides an access to current breakpoint, stylers, etc
   */
  ctx: StylerSheetResolveContext,
) => StylerResult;

export interface StyleSheetThemeSettings<
  TFaces extends StyleSheetFaces = StyleSheetFaces
> {
  colors: {
    [color: string]: string | undefined | ScaleValue<string>;
  };
  /**
   * Faces are used to override component's local styles (post styles) using face styler
   */
  faces?: TFaces;
  fontFamily: { [name: string]: string | undefined };
  /**
   * Mixins are used as bases for extending shared styles using extends styler
   */
  mixins?: {
    [mixin: string]: StyleSheet;
  };
  // any extra values
  [extra: string]: any;
}

export interface StylerSheetResolveContext<
  TThemeSettings extends StyleSheetThemeSettings = StyleSheetThemeSettings
> {
  /** Current device breakpoint */
  breakpoint: number;
  /** All formatters defined in the system */
  formatters: {
    [name: string]: StyleValueFormatter;
  };
  /** All resolvers defined in the system */
  resolvers: {
    themeKey: StyleValueResolver;
    [name: string]: StyleValueResolver;
  };
  /** Styler resolution cache  */
  stylerCache: LRUCache<string, StylerResult>;
  /** All stylers defined in the system */
  stylers: {
    catchAll: StylerFunction;
    extends: StylerFunction;
    face: StylerFunction;
    [name: string]: StylerFunction;
  };
  format: StyleValueFormatter;
  resolve: StyleValueResolver;
  style: StylerFunction;
  theme: TThemeSettings;
}
