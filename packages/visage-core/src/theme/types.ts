import {
  StyleValueFormatter,
  StyleValueResolver,
  StylerFunction,
  StylerResultType,
} from '../styleSheet';

export interface ThemeStylerSettingsObject<
  TFormatterNames extends keyof any,
  TResolverNames extends keyof any,
> {
  /** Type of style, by default it's InPlaceFinal */
  type?: StylerResultType;
  /**
   * Name of a formatter to be used to format a resolved value
   */
  format?: TFormatterNames;
  /**
   * Name of a resolver to be used to resolve a value
   */
  resolver?: TResolverNames;
  /**
   * Output props
   * Basically it will append the generated value under the keys defined by this array of strings or string
   *
   * For example you can have px styler, that ouputs padding-left and padding-right
   */
  outputProps?: string | string[];
}

export type ThemeStylerSettings<
  TFormatterNames extends keyof any,
  TResolverNames extends keyof any,
> = StylerFunction | ThemeStylerSettingsObject<TFormatterNames, TResolverNames>;

export type ThemeFormatterMap<TFormatterNames extends keyof any> = {
  [K in TFormatterNames]: StyleValueFormatter;
};

export type ThemeResolverMap<TResolverNames extends keyof any> = {
  [K in TResolverNames]: StyleValueResolver;
};

export type ThemeStylerMap<
  TStylersName extends keyof any = any,
  TFormattersName extends keyof any = any,
  TResolversName extends keyof any = any,
> = {
  [K in TStylersName]: ThemeStylerSettings<TFormattersName, TResolversName>;
};
