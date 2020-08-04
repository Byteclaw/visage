import { LRUCache } from '@byteclaw/visage-utils';
import { useContext, useRef } from 'react';
import { createCache, StyleSheetCache } from './cache';
import { VisageContext } from './context';
import {
  ExtractThemeSettingsFromTheme,
  Visage,
  Theme,
  StyleGenerator,
} from './types';
import {
  resolveStyleSheets,
  StylerSheetResolveContext,
  ResolvedStyleSheet,
  StyleSheet,
} from './styleSheet';
import { useStaticMemo } from './useStaticMemo';

interface DesignSystemCache {
  generation: Map<number, WeakMap<StyleSheet[], ResolvedStyleSheet>>;
  resolution: StylerSheetResolveContext['resolutionCache'];
  styler: StylerSheetResolveContext['stylerCache'];
  styleSheet: Map<number, StyleSheetCache>;
}

function createDesignSystem<TTheme extends Theme = Theme>(
  breakpoint: number = 0,
  theme: any,
  styleGenerator: StyleGenerator,
  { generation, resolution, styler, styleSheet }: DesignSystemCache,
): Visage<TTheme> {
  if (!resolution.has(breakpoint)) {
    resolution.set(breakpoint, new WeakMap());
  }

  if (!generation.has(breakpoint)) {
    generation.set(breakpoint, new WeakMap());
  }

  if (!styleSheet.has(breakpoint)) {
    styleSheet.set(breakpoint, createCache());
  }

  const generationCache = generation.get(breakpoint)!;
  const resolutionForBreakpointCache = resolution.get(breakpoint)!;
  const styleSheetCache = styleSheet.get(breakpoint)!;

  const resolveCtx: StylerSheetResolveContext<ExtractThemeSettingsFromTheme<
    TTheme
  >> = {
    breakpoint,
    format: theme.format,
    resolve: theme.resolve,
    style: theme.style,
    formatters: theme.formatters,
    resolvers: theme.resolvers,
    resolutionCache: resolution,
    stylers: theme.stylers,
    stylerCache: styler,
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
      let result = resolutionForBreakpointCache.get(styleSheets);

      if (!result) {
        result = resolveStyleSheets(styleSheets, resolveCtx);
        resolutionForBreakpointCache.set(styleSheets, result);
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
    const cacheRef = useRef<DesignSystemCache>();
    const generatorRef = useRef<StyleGenerator>(options.styleGenerator);
    const themeRef = useRef(options.theme);

    if (
      !cacheRef.current ||
      generatorRef.current !== options.styleGenerator ||
      themeRef.current !== options.theme
    ) {
      cacheRef.current = {
        generation: new Map(),
        resolution: new Map(),
        styleSheet: new Map(),
        styler: new LRUCache(1000),
      };
      generatorRef.current = options.styleGenerator;
      themeRef.current = options.theme;
    }

    return useStaticMemo(createDesignSystem, [
      options.is,
      options.theme,
      options.styleGenerator,
      cacheRef.current,
    ]);
  }

  // ctx is defined because there is a check above
  return ctx as Visage<TTheme>;
}
