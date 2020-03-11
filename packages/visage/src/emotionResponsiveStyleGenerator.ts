import {
  resolveStyleSheets,
  StyleGenerator,
  ResolvedStyleSheet,
} from '@byteclaw/visage-core';
import { css } from 'emotion';

/**
 * Generates styles with media queries
 */
export function createResponsiveEmotionStyleGenerator(
  /**
   * Media queries sorted from smallest to largest device
   *
   * Please provide only conditions e.g. only screen or screen and (min-width: 40em)
   */
  mediaQueries: string[],
): StyleGenerator {
  return (styleSheets, ctx) => {
    const sheet: { [mediaQuery: string]: ResolvedStyleSheet } = {};

    // iterate through media queries and resolve style for them
    mediaQueries.forEach((mediaQuery, breakpoint) => {
      sheet[`@media ${mediaQuery}`] = resolveStyleSheets(styleSheets, {
        ...ctx,
        breakpoint,
      });
    });

    return {
      className: css(sheet),
    };
  };
}
