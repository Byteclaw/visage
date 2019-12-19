import { resolveStyleSheet, StyleGenerator } from '@byteclaw/visage-core';
import { css } from 'emotion';

export const styleGenerator: StyleGenerator = (
  styleSheet,
  breakpoint,
  theme,
) => {
  // iterate through style sheet and map pseudos properly
  const resolvedStyleSheet = resolveStyleSheet(styleSheet, breakpoint, theme);

  return {
    className: css(resolvedStyleSheet),
  };
};
