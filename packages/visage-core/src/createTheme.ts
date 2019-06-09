import {
  getResponsiveValue,
  ScaleValue,
  getScaleValue,
} from '@byteclaw/visage-utils';
import { Theme } from './types';

interface FormatterFn {
  (value: any, ctx: FormatterAndResolverContext): any;
}

interface ResolverFn {
  (value: any, ctx: FormatterAndResolverContext): any;
}

interface FormatterAndResolverContext {
  format(name: string, value: any): any;
  resolve(name: string, value: any): any;
  themeSettings: ThemeSettings;
}

interface StylerSettings<
  TFormatterNames extends keyof any,
  TResolverNames extends keyof any
> {
  format?: TFormatterNames | DefaultFormatters;
  resolver?: TResolverNames;
  outputProps?: string | string[]; // px = padding-left, padding-right
  themeKey?: string;
}

interface ResolvedStylerSettings {
  format: FormatterFn;
  resolve: ResolverFn;
  outputProps: string[];
  themeKey?: string;
}

export type FormatterMap<TFormatterNames extends keyof any> = {
  [K in TFormatterNames]: FormatterFn
};

export type ResolverMap<TResolverNames extends keyof any> = {
  [K in TResolverNames]: ResolverFn
};

export interface StylerMap<
  TFormatterNames extends keyof any = any,
  TResolverNames extends keyof any = any
> {
  [prop: string]: StylerSettings<TFormatterNames, TResolverNames>;
}

interface ResolvedStylerMap {
  [prop: string]: ResolvedStylerSettings;
}

export interface ThemeSettings {
  [key: string]:
    | string
    | number
    | ScaleValue<any>
    | { [nested: string]: string | number | ScaleValue<any> };
}

export interface ThemeOptions<
  TFormatterNames extends keyof any,
  TResolverNames extends keyof any
> {
  formatters?: FormatterMap<TFormatterNames>;
  resolvers?: ResolverMap<TResolverNames>;
  stylers?: StylerMap<TFormatterNames>;
  theme?: ThemeSettings;
}

function resolveOnTheme(
  value: any,
  themeKey: string,
  themeSettings: ThemeSettings,
): any {
  const themeValue = themeSettings[themeKey];

  switch (typeof themeValue) {
    case 'undefined':
      return value;
    case 'object': {
      if (themeValue !== null) {
        const [propertyName, position] = value.toString().split('.');

        // check if value is scale
        if (themeValue.offset != null && themeValue.values != null) {
          return (
            getScaleValue(
              themeValue as ScaleValue<any>,
              Number(position || 0),
            ) || value
          );
        }

        // resolve on deep property, e.g. color pallete
        return resolveOnTheme(value, propertyName, themeValue as ThemeSettings);
      }
    }
    // eslint-disable-next-line no-fallthrough
    default:
      return themeValue;
  }
}

function applyStyler(
  propName: string,
  value: any,
  stylers: ResolvedStylerMap,
  ctx: FormatterAndResolverContext,
): { properties: string[]; value: any } {
  // if there is a styler for this prop, apply it, otherwise return a value under the same propName
  const styler = stylers[propName];

  if (styler) {
    const style = styler.format(
      styler.resolve(
        styler.themeKey
          ? resolveOnTheme(value, styler.themeKey, ctx.themeSettings)
          : value,
        ctx,
      ),
      ctx,
    );

    return {
      properties: styler.outputProps,
      value: style,
    };
  }

  return {
    properties: [propName],
    value,
  };
}

type DefaultFormatters = 'px';
const defaultFormatters: FormatterMap<DefaultFormatters> = {
  px(value) {
    return `${Math.round(value)}px`;
  },
};
const defaultFormatter: FormatterFn = val => val;
const defaultResolver: ResolverFn = val => val;

function resolveFormatter(
  formatters: FormatterMap<any>,
  name: undefined | keyof any,
): FormatterFn {
  if (!name) {
    return defaultFormatter;
  }

  const formatter = formatters[name as any];

  if (formatter) {
    return formatter;
  }

  throw new Error(`Formatter "${name as string}" is not defined`);
}

function resolveResolver(
  resolvers: ResolverMap<any>,
  name: undefined | keyof any,
): ResolverFn {
  if (!name) {
    return defaultResolver;
  }

  const resolver = resolvers[name as any];

  if (resolver) {
    return resolver;
  }

  throw new Error(`Resolver "${name as string}" is not defined`);
}

export function createTheme<
  TFormatterNames extends keyof any = any,
  TResolverNames extends keyof any = any
>({
  formatters = {} as FormatterMap<any>,
  resolvers = {} as ResolverMap<any>,
  stylers = {} as StylerMap<any>,
  theme: themeSettings = {},
}: ThemeOptions<TFormatterNames, TResolverNames>): Theme {
  const allFormatters = {
    ...defaultFormatters,
    ...formatters,
  };
  const resolvedStylers: ResolvedStylerMap = {};

  Object.keys(stylers).forEach(propName => {
    const settings = stylers[propName];

    resolvedStylers[propName] = {
      ...settings,
      resolve: resolveResolver(resolvers, settings.resolver),
      format: resolveFormatter(allFormatters, settings.format),
      outputProps:
        settings.outputProps && Array.isArray(settings.outputProps)
          ? settings.outputProps
          : ([settings.outputProps || propName] as string[]),
    };
  });

  const formatterAndResolverContext: FormatterAndResolverContext = {
    format(name, value) {
      return resolveFormatter(formatters, name)(
        value,
        formatterAndResolverContext,
      );
    },
    resolve(name, value) {
      return resolveResolver(resolvers, name)(
        value,
        formatterAndResolverContext,
      );
    },
    themeSettings,
  };

  function resolve(
    propName: string,
    propValue: any,
    breakpoint: number,
  ): { properties: string[]; value: any } {
    const value = getResponsiveValue(breakpoint, undefined, propValue);

    return applyStyler(
      propName,
      value,
      resolvedStylers,
      formatterAndResolverContext,
    );
  }

  return {
    resolve,
  };
}
