import { useMemo, useContext } from 'react';
import { createCache } from './cache';
import { VisageContext } from './context';
import {
  ExtractThemeSettingsFromTheme,
  Visage,
  Theme,
  StyleGenerator,
  ExtractArgs,
  ExtractReturn,
} from './types';
import { resolveStyleSheets, StylerSheetResolveContext } from './styleSheet';

function useStaticMemo<TFunction extends (...args: any[]) => any>(
  fn: TFunction,
  deps: ExtractArgs<TFunction>,
): ExtractReturn<TFunction> {
  return useMemo(() => fn(...deps), deps);
}

function createDesignSystem<TTheme extends Theme = Theme>(
  breakpoint: number = 0,
  theme: any,
  styleGenerator: any,
): Visage<TTheme> {
  // reset cache everytime the design system is recreated
  const generationCache = new WeakMap();
  const resolutionCache = new WeakMap();
  const styleSheetCache = createCache();

  const resolveCtx: StylerSheetResolveContext<ExtractThemeSettingsFromTheme<
    TTheme
  >> = {
    breakpoint,
    format: theme.format,
    resolve: theme.resolve,
    style: theme.style,
    formatters: theme.formatters,
    resolvers: theme.resolvers,
    stylers: theme.stylers,
    theme: theme.theme as any,
  };

  return {
    breakpoint,
    styleSheetCache,
    ctx: resolveCtx,
    generate(styleSheets) {
      let result = generationCache.get(styleSheets);

      if (!result) {
        result = styleGenerator(styleSheets, resolveCtx);
        generationCache.set(styleSheets, result);
      }

      return result;
    },
    resolveStyleSheets(styleSheets) {
      let result = resolutionCache.get(styleSheets);

      if (!result) {
        result = resolveStyleSheets(styleSheets, resolveCtx);
        resolutionCache.set(styleSheets, result);
      }

      return result;
    },
    theme: resolveCtx.theme,
  };
}

export interface UseDesignSystemHookOptions<TTheme extends Theme = Theme> {
  is?: number;
  styleGenerator: StyleGenerator;
  theme: TTheme;
}
/**
 * Use design system works as root hook that can be used to create own DesignSystem
 *
 * If no options are provided then it works as useContext that connects to Visage context
 */
export function useDesignSystem<TTheme extends Theme = Theme>(
  options?: UseDesignSystemHookOptions<TTheme>,
): Visage<TTheme> {
  // if options are provided, we want to create new Visage instance
  // otherwise we want to connect to parent
  const ctx: Visage<TTheme> | undefined = useContext(VisageContext);

  if (!ctx) {
    if (!options) {
      throw new Error(
        `Options must be provided to useDesignSystem if used for first time`,
      );
    }
  }

  // if we pass options, we want to create new design system root
  if (options) {
    return useStaticMemo(createDesignSystem, [
      options.is,
      options.theme,
      options.styleGenerator,
    ]);
  }

  // ctx is defined because there is a check above
  return ctx as Visage<TTheme>;
}
