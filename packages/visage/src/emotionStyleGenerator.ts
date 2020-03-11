import { resolveStyleSheets, StyleGenerator } from '@byteclaw/visage-core';
import { css } from 'emotion';

/**
 * Creates emotion style generator
 *
 * Be careful, this style generator doesn't generate media queries, responsivity is handled using
 * breakpoint argument.
 */
export function createEmotionStyleGenerator(): StyleGenerator {
  return (styleSheets, ctx) => {
    // iterate through style sheet and map pseudos properly
    const resolvedStyleSheet = resolveStyleSheets(styleSheets, ctx);

    return {
      className: css(resolvedStyleSheet),
    };
  };
}
