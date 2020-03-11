import { ThemeFormatterMap } from './types';
import { StyleValueFormatter } from '../styleSheet';

/**
 * Pixel formatter, exports number as px (number is rounded)
 */
const px: StyleValueFormatter = function px(propName, value) {
  if (typeof value !== 'number') {
    return value;
  }

  return `${Math.round(value)}px`;
};

/**
 * Size unit formatter, exports number as px (if integer) or as % if floating
 */
const sizeUnit: StyleValueFormatter = function sizeUnit(propName, value) {
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
