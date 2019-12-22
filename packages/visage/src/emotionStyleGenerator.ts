import { resolveStyleSheet, StyleGenerator } from '@byteclaw/visage-core';
import { css } from 'emotion';

/**
 * Creates emotion style generator
 *
 * Be careful, this style generator doesn't generate media queries, responsivity is handled using
 * breakpoint argument.
 */
export function createEmotionStyleGenerator(): StyleGenerator {
  return (styleSheet, breakpoint, theme) => {
    // iterate through style sheet and map pseudos properly
    const resolvedStyleSheet = resolveStyleSheet(styleSheet, breakpoint, theme);

    return {
      className: css(resolvedStyleSheet),
    };
  };
}
