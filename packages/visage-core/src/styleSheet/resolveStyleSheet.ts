import {
  depthFirstObjectMerge,
  getResponsiveValue,
} from '@byteclaw/visage-utils';
import {
  StyleSheet,
  StylerSheetResolveContext,
  ResolvedStyleSheet,
  StylerResultType,
} from './types';

/**
 * Resolves style sheet
 */
export function resolveStyleSheet(
  styleSheet: StyleSheet,
  ctx: StylerSheetResolveContext,
): ResolvedStyleSheet {
  const cache = ctx.resolutionCache.get(ctx.breakpoint);

  if (!cache) {
    ctx.resolutionCache.set(ctx.breakpoint, new WeakMap());
  }

  if (cache?.has(styleSheet)) {
    return cache.get(styleSheet)!;
  }

  const keys = Object.keys(styleSheet);
  const keysLength = keys.length;
  const preSheets: ResolvedStyleSheet[] = [];
  const postSheets: ResolvedStyleSheet[] = [];
  let resolvedStyleSheet: ResolvedStyleSheet = {};

  for (let i = 0; i < keysLength; i++) {
    const key = keys[i];
    const value = styleSheet[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      resolvedStyleSheet[key] = resolveStyleSheet(value, ctx);
    } else {
      const responsiveValue = getResponsiveValue(ctx.breakpoint, value);
      const styler = ctx.stylers[key] ?? ctx.stylers.catchAll;
      const result = styler(key, responsiveValue, ctx);

      switch (result.type) {
        case StylerResultType.pre: {
          preSheets.push(resolveStyleSheet(result.styles, ctx));
          break;
        }
        case StylerResultType.post: {
          postSheets.push(resolveStyleSheet(result.styles, ctx));
          break;
        }
        case StylerResultType.inPlace: {
          resolvedStyleSheet = depthFirstObjectMerge(
            resolvedStyleSheet,
            resolveStyleSheet(result.styles, ctx),
          );
          break;
        }
        case StylerResultType.inPlaceFinal: {
          resolvedStyleSheet = depthFirstObjectMerge(
            resolvedStyleSheet,
            result.styles,
          );
          break;
        }
        case StylerResultType.preFinal: {
          preSheets.push(result.styles);
          break;
        }
        case StylerResultType.postFinal: {
          postSheets.push(result.styles);
          break;
        }
      }
    }
  }

  const finalStyleSheet = depthFirstObjectMerge(
    ...preSheets,
    resolvedStyleSheet,
    ...postSheets,
  );

  cache?.set(styleSheet, finalStyleSheet);

  return finalStyleSheet;
}
