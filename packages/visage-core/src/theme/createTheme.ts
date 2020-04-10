import { formatters as coreFormatters } from './formatters';
import { resolvers as coreResolvers } from './resolvers';
import { stylers as coreStylers } from './stylers';
import { Theme } from '../types';
import {
  ThemeFormatterMap,
  ThemeResolverMap,
  ThemeStylerMap,
  ThemeStylerSettings,
  ThemeStylerSettingsObject,
} from './types';
import { createStylerFromSettings } from './createStylerFromSettings';
import {
  StylerFunction,
  StyleSheetFaces,
  StyleValueFormatter,
  StyleValueResolver,
  ValidStyleSheet,
  StyleSheetThemeSettings,
} from '../styleSheet';

export interface CreateThemeFactory<
  TStyleSheet extends ValidStyleSheet,
  TDefaultFaces extends StyleSheetFaces
> {
  <
    TFormattersName extends keyof any = any,
    TResolversName extends keyof any = any,
    TStylersName extends keyof any = any,
    TFaces extends StyleSheetFaces = TDefaultFaces
  >(
    options: ThemeOptions<
      TFormattersName,
      TResolversName,
      TStylersName,
      TFaces
    >,
  ): Theme;
}

type CoreFormattersName = keyof typeof coreFormatters;
type CoreResolversName = keyof typeof coreResolvers;
type CoreStylersName = keyof typeof coreStylers;

interface ResolvedStylerMap {
  extends: StylerFunction;
  face: StylerFunction;
  catchAll: StylerFunction;
  [name: string]: StylerFunction;
}

export interface ThemeOptions<
  TFormattersName extends keyof any,
  TResolversName extends keyof any,
  TStylersName extends keyof any,
  TFaces extends StyleSheetFaces = StyleSheetFaces
> {
  formatters?: ThemeFormatterMap<TFormattersName> &
    // these are optional so you can override defaults
    { [K in CoreFormattersName]?: StyleValueFormatter };
  resolvers?: ThemeResolverMap<TResolversName> &
    // these are optional so you can override defaults
    { [K in CoreResolversName]?: StyleValueResolver };
  stylers?: ThemeStylerMap<TStylersName> &
    // these are optional so you can override defaults
    {
      [K in CoreStylersName]?: ThemeStylerSettings<
        TFormattersName | CoreFormattersName,
        TResolversName | CoreResolversName
      >;
    };
  theme: StyleSheetThemeSettings<TFaces>;
}

function check(
  type: 'resolver' | 'formatter',
  name: string,
  map: { [key: string]: any },
) {
  if (map[name] == null) {
    throw new Error(`${type} ${name} is missing`);
  }
}

export function createTheme<
  TFormattersName extends keyof any = any,
  TResolversName extends keyof any = any,
  TStylersName extends keyof any = any,
  TFaces extends StyleSheetFaces = StyleSheetFaces
>({
  formatters = {} as ThemeFormatterMap<TFormattersName>,
  resolvers = {} as ThemeResolverMap<TResolversName>,
  stylers = {} as ThemeStylerMap<TStylersName>,
  theme,
}: ThemeOptions<TFormattersName, TResolversName, TStylersName, TFaces>): Theme {
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
  // const faces: TFaces = themeSettings.faces || ({} as TFaces);
  const resolvedStylers: ResolvedStylerMap = {} as any;

  (Object.keys(allStylers) as Array<keyof typeof allStylers>).forEach(
    propName => {
      const settings: StylerFunction | ThemeStylerSettingsObject<any, any> =
        allStylers[propName];

      if (typeof settings === 'function') {
        resolvedStylers[propName as string] = settings;
      } else {
        if (settings.resolver) {
          check('resolver', settings.resolver, allResolvers);
        }

        if (settings.format) {
          check('formatter', settings.format, allFormatters);
        }

        resolvedStylers[propName as string] = createStylerFromSettings(
          propName as string,
          settings,
        );
      }
    },
  );

  return {
    formatters: allFormatters,
    resolvers: allResolvers,
    stylers: resolvedStylers,
    format(formatterName, propValue, ctx) {
      if (allFormatters[formatterName as TFormattersName]) {
        return allFormatters[formatterName as TFormattersName](
          formatterName as any,
          propValue,
          ctx,
        );
      }

      return propValue;
    },
    resolve(resolverName, propValue, ctx) {
      return (
        allResolvers[resolverName as TResolversName] ?? allResolvers.themeKey
      )(resolverName, propValue, ctx);
    },
    style(resolverName, propValue, ctx) {
      return (resolvedStylers[resolverName] ?? resolvedStylers.catchAll)(
        resolverName,
        propValue,
        ctx,
      );
    },
    theme,
  };
}
