import { formatters } from './formatters';
import { resolvers } from './resolvers';
import { colorProps } from './constants';
import { ThemeStylerSettings, ThemeStylerMap } from './types';

type ColorPropNames = typeof colorProps[number];

export const stylers: ThemeStylerMap<
  ColorPropNames | 'fontFamily' | 'catchAll'
> = {
  ...colorProps.reduce(
    (colorStylers, propName) => ({
      ...colorStylers,
      [propName]: {
        resolver: 'color',
      } as ThemeStylerSettings<keyof typeof formatters, keyof typeof resolvers>,
    }),
    {} as ThemeStylerMap<ColorPropNames>,
  ),
  fontFamily: {
    resolver: 'fontFamily',
  },
  catchAll: {
    resolver: 'themeKey',
  },
};
