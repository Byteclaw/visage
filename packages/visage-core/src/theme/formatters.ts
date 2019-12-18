import { ThemeFormatterFunction, ThemeFormatterMap } from './types';

/**
 * Pixel formatter, exports number as px
 */
const px: ThemeFormatterFunction = function px(propName: string, value: any) {
  if (typeof value !== 'number') {
    return value;
  }

  return `${Math.round(value)}px`;
};

export const formatters: ThemeFormatterMap<'px'> = {
  px,
};
