import { useRef, useMemo, useContext } from 'react';
import { VisageContext } from './context';
import {
  ExtractThemeSettingsFromTheme,
  Visage,
  Theme,
  StyleGenerator,
} from './types';
import { resolveStyleSheets, StylerSheetResolveContext } from './styleSheet';

export interface UseDesignSystemHookOptions<TTheme extends Theme = Theme> {
  is?: number;
  styleGenerator: StyleGenerator;
  theme: TTheme;
}

interface Refs {
  theme: Theme | undefined;
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
  const refs = useRef<Refs>({
    theme: undefined,
  });

  if (!ctx) {
    if (!options) {
      throw new Error(
        `Options must be provided to useDesignSystem if used for first time`,
      );
    }
  }

  // if we pass options, we want to create new design system root
  if (options) {
    return useMemo(() => {
      const breakpoint = options.is || 0;

      if (refs.current.theme !== options.theme) {
        refs.current.theme = options.theme;
      }

      const resolveCtx: StylerSheetResolveContext<ExtractThemeSettingsFromTheme<
        TTheme
      >> = {
        breakpoint,
        format: options.theme.format,
        resolve: options.theme.resolve,
        style: options.theme.style,
        formatters: options.theme.formatters,
        resolvers: options.theme.resolvers,
        stylers: options.theme.stylers,
        theme: options.theme.theme as any,
      };

      return {
        breakpoint,
        ctx: resolveCtx,
        generate(...styleSheets) {
          return options.styleGenerator(styleSheets, resolveCtx);
        },
        resolveStyleSheets(...styleSheets) {
          return resolveStyleSheets(styleSheets, resolveCtx);
        },
        theme: resolveCtx.theme,
      };
    }, [options.is, options.theme, options.styleGenerator]);
  }

  // ctx is defined because there is a check above
  return ctx as Visage<TTheme>;
}
