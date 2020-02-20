import { getResponsiveValue } from '@byteclaw/visage-utils';
import {
  formatters as coreFormatters,
  resolvers as coreResolvers,
  stylers as coreStylers,
  Theme,
  ThemeFormatterMap,
  ThemeResolverMap,
  ThemeStylerMap,
  ThemeSettings,
  ThemeFormatterFunction,
  ThemeResolverFunction,
  ThemeFormatterAndResolverContext,
  ThemeStylerSettings,
} from './theme';

type CoreFormattersName = keyof typeof coreFormatters;
type CoreResolversName = keyof typeof coreResolvers;
type CoreStylersName = keyof typeof coreStylers;

interface ResolvedStylerSettings {
  format: ThemeFormatterFunction;
  resolve: ThemeResolverFunction;
  outputProps: string[];
  themeKey?: string;
}

type ResolvedStylerMap<TStylersName extends keyof any> = {
  [prop in TStylersName]: ResolvedStylerSettings;
};

export interface ThemeOptions<
  TFormattersName extends keyof any,
  TResolversName extends keyof any,
  TStylersName extends keyof any
> {
  formatters?: ThemeFormatterMap<TFormattersName> &
    // these are optional so you can override defaults
    { [K in CoreFormattersName]?: ThemeFormatterFunction };
  resolvers?: ThemeResolverMap<TResolversName> &
    // these are optional so you can override defaults
    { [K in CoreResolversName]?: ThemeResolverFunction };
  stylers?: ThemeStylerMap<TStylersName> &
    // these are optional so you can override defaults
    {
      [K in CoreStylersName]?: ThemeStylerSettings<
        TFormattersName | CoreFormattersName,
        TResolversName | CoreResolversName
      >;
    };
  theme?: ThemeSettings;
}

const defaultFormatter: ThemeFormatterFunction = (_, val) => val;
const defaultResolver: ThemeResolverFunction = (_, val) => val;

function resolveFormatter(
  formatters: ThemeFormatterMap<any>,
  name: undefined | keyof any,
): ThemeFormatterFunction {
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
  resolvers: ThemeResolverMap<any>,
  name: undefined | keyof any,
): ThemeResolverFunction {
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
  TFormattersName extends keyof any = any,
  TResolversName extends keyof any = any,
  TStylersName extends keyof any = any
>({
  formatters = {} as ThemeFormatterMap<TFormattersName>,
  resolvers = {} as ThemeResolverMap<TResolversName>,
  stylers = {} as ThemeStylerMap<TStylersName>,
  theme: themeSettings = { colors: {}, fontFamily: {} },
}: ThemeOptions<TFormattersName, TResolversName, TStylersName>): Theme {
  const allFormatters = {
    ...coreFormatters,
    ...formatters,
  };
  const allResolvers = {
    ...coreResolvers,
    ...resolvers,
  };
  const allStylers: ThemeStylerMap<
    CoreStylersName | TStylersName,
    CoreFormattersName | TFormattersName,
    CoreResolversName | TResolversName
  > = {
    ...coreStylers,
    ...stylers,
  };
  const resolvedStylers: ResolvedStylerMap<
    CoreStylersName | TStylersName
  > = {} as any;

  (Object.keys(allStylers) as Array<keyof typeof allStylers>).forEach(
    propName => {
      const settings = allStylers[propName];

      resolvedStylers[propName] = {
        ...settings,
        resolve: resolveResolver(allResolvers, settings.resolver),
        format: resolveFormatter(allFormatters, settings.format),
        outputProps:
          settings.outputProps && Array.isArray(settings.outputProps)
            ? settings.outputProps
            : ([settings.outputProps || propName] as string[]),
      };
    },
  );

  const formatterAndResolverContext: ThemeFormatterAndResolverContext = {
    format(propName, formatterName, value) {
      return resolveFormatter(formatters, formatterName)(
        propName,
        value,
        formatterAndResolverContext,
      );
    },
    resolve(propName, resolverName, value, breakpoint) {
      return resolveResolver(allResolvers, resolverName)(
        propName,
        value,
        formatterAndResolverContext,
        breakpoint,
      );
    },
    themeSettings,
  };

  function resolve(
    propName: string,
    propValue:
      | string
      | number
      | null
      | undefined
      | (string | number | null | undefined)[],
    breakpoint: number,
  ): { properties: string[]; value: any } {
    const value = getResponsiveValue(breakpoint, propValue, undefined);

    const styler =
      resolvedStylers[propName as keyof typeof resolvedStylers] ||
      resolvedStylers.catchAll;

    const styleValue = styler.format(
      propName,
      styler.resolve(propName, value, formatterAndResolverContext, breakpoint),
      formatterAndResolverContext,
    );

    return {
      properties:
        styler === resolvedStylers.catchAll ? [propName] : styler.outputProps,
      value: styleValue,
    };
  }

  return {
    resolve,
  };
}
