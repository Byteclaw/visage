import { ScaleValue } from '@byteclaw/visage-utils';

export interface ThemeFormatterAndResolverContext {
  /**
   * Formats value using a formatter specified by a name
   */
  format(
    /**
     * Style property name that is being resolved (do not confuse with output property)
     */
    propName: string,
    /**
     * Name of a formatter to format the value
     */
    formatterName: string,
    /**
     * Value to be formatted
     */
    value: any,
  ): any;
  /**
   * Resolves a value using a resolver specified by a name
   */
  resolve(
    /**
     * Style property name that is being resolved (do not confuse with output property)
     */
    propName: string,
    /**
     * Name of a resolver to resolve the value
     */
    resolverName: string,
    /**
     * Value that will be resolved
     */
    value: any,
    /**
     * Current responsive breakpoint
     */
    breakpoint: number,
  ): any;
  themeSettings: ThemeSettings;
}

export interface ThemeFormatterFunction {
  (
    /**
     * Style property name that is being resolved (do not confuse with output property)
     */
    propName: string,
    /**
     * Value resolved by a resolver that is being formatter for final style sheet
     */
    resolvedValue: any,
    ctx: ThemeFormatterAndResolverContext,
  ): any;
}

/**
 * Function that resolves a value from style to a value for style sheet that will be passed to
 * formatter function
 */
export interface ThemeResolverFunction {
  (
    /**
     * Style property name that is being resolved  (do not confuse with output property)
     */
    propName: string,
    /**
     * Value that is being resolved
     */
    valueToResolve: any,
    ctx: ThemeFormatterAndResolverContext,
    /**
     * Current responsive breakpoint
     */
    breakpoint: number,
  ): any;
}

export interface ThemeStylerSettings<
  TFormatterNames extends keyof any,
  TResolverNames extends keyof any
> {
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

export type ThemeFormatterMap<TFormatterNames extends keyof any> = {
  [K in TFormatterNames]: ThemeFormatterFunction;
};

export type ThemeResolverMap<TResolverNames extends keyof any> = {
  [K in TResolverNames]: ThemeResolverFunction;
};

export type ThemeStylerMap<
  TStylersName extends keyof any = any,
  TFormattersName extends keyof any = any,
  TResolversName extends keyof any = any
> = {
  [K in TStylersName]: ThemeStylerSettings<TFormattersName, TResolversName>;
};

/**
 * Theme settings
 */
export interface ThemeSettings {
  [key: string]:
    | undefined
    | string
    | string[]
    | number
    | number[]
    | ScaleValue<any>
    | { [nested: string]: undefined | string | number | ScaleValue<any> };
}

export interface Theme {
  /**
   * Resolves a style prop name to a final output that will be processed by style applier
   */
  resolve(
    /**
     * Style property name that is being resolved  (do not confuse with output property)
     */
    propName: string,
    /**
     * Property value to be resolved
     */
    propValue: any,
    /**
     * Current responsive breakpoint
     */
    breakpoint: number,
  ): {
    /**
     * Value to be assigned to style sheet properties
     */
    value: any;
    /**
     * Final style sheet properties that will be assigned a value
     */
    properties: string[];
  };
}
