import { StyleGenerator } from '@byteclaw/visage-core';
import { css, Interpolation } from 'emotion';

const validPseudos = ['active', 'hover', 'focus', 'visited'];

export const styleGenerator: StyleGenerator = styleSheet => {
  // iterate through style sheet and map pseudos properly
  const keys = Object.keys(styleSheet);
  const keysLength = keys.length;
  const styles: Interpolation = {};

  for (let i = 0; i < keysLength; i++) {
    const key = keys[i];
    const styleValue = styleSheet[key];

    if (typeof styleValue === 'object') {
      // pseudostyle, detect if it is selector or not
      if (key.startsWith(':') || key.startsWith('[')) {
        styles[`&${key}`] = styleValue;
      } else if (validPseudos.includes(key)) {
        styles[`&:${key}`] = styleValue;
      } else if (!key.startsWith('&')) {
        styles[`& ${key}`] = styleValue;
      } else {
        styles[key] = styleValue;
      }
    } else {
      styles[key] = styleValue;
    }
  }

  return {
    className: css(styles),
  };
};
