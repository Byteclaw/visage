import { StyleGenerator } from '@byteclaw/visage-core';
import { css } from 'emotion';

export const styleGenerator: StyleGenerator = styleSheet => {
  // iterate through style sheet and map pseudos properly

  return {
    className: css(styleSheet),
  };
};
