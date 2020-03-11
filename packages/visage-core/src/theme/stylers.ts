import { formatters } from './formatters';
import { resolvers } from './resolvers';
import { colorProps } from './constants';
import { ThemeStylerSettings, ThemeStylerMap } from './types';
import { catchAllStyler, extendsStyler, faceStyler } from '../styleSheet';

type ColorPropNames = typeof colorProps[number];

export const stylers: ThemeStylerMap<
  ColorPropNames | 'catchAll' | 'extends' | 'face'
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
  catchAll: catchAllStyler,
  extends: extendsStyler,
  face: faceStyler,
};
