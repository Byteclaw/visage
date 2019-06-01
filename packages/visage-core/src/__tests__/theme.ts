import { getResponsiveValue } from '@byteclaw/visage-utils';
import { Theme } from '../types';

export function createTheme(breakpoint: number): Theme {
  return {
    breakpoint() {
      return breakpoint;
    },
    resolve(prop, value, defaultValue) {
      return getResponsiveValue(breakpoint, defaultValue, value);
    },
    stylers() {
      return {};
    },
  };
}
