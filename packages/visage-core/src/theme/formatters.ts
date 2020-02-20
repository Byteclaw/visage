import { ThemeFormatterFunction, ThemeFormatterMap } from './types';

/**
 * Pixel formatter, exports number as px (number is rounded)
 */
const px: ThemeFormatterFunction = function px(propName: string, value: any) {
  if (typeof value !== 'number') {
    return value;
  }

  return `${Math.round(value)}px`;
};

/**
 * Size unit formatter, exports number as px (if integer) or as % if floating
 */
const sizeUnit: ThemeFormatterFunction = function sizeUnit(
  propName: string,
  value: any,
) {
  if (typeof value !== 'number') {
    return value;
  }

  if (Number.isInteger(value)) {
    return `${value}px`;
  }

  return `${value}%`;
};

export const formatters: ThemeFormatterMap<'px' | 'sizeUnit'> = {
  px,
  sizeUnit,
};
