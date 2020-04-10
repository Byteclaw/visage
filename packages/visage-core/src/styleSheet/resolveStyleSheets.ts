import { depthFirstObjectMerge } from '@byteclaw/visage-utils';
import { resolveStyleSheet } from './resolveStyleSheet';
import {
  ResolvedStyleSheet,
  StyleSheet,
  StylerSheetResolveContext,
} from './types';

/**
 * Resolves style sheets and merges them using depth first algorithm from right to left
 */
export function resolveStyleSheets(
  styleSheets: StyleSheet[],
  ctx: StylerSheetResolveContext,
): ResolvedStyleSheet {
  return depthFirstObjectMerge(
    ...styleSheets.map(styleSheet => resolveStyleSheet(styleSheet, ctx)),
  );
}
