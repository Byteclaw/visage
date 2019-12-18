import { formatters } from './formatters';
import { resolvers } from './resolvers';
import { ThemeStylerSettings, ThemeStylerMap } from './types';

const colorProps = [
  'backgroundColor',
  'borderColor',
  'borderBlockColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'borderBlockColor',
  'borderBlockEndColor',
  'borderBlockStartColor',
  'borderInlineColor',
  'borderInlineEndColor',
  'borderInlineStartColor',
  'color',
  'fill',
  'outlineColor',
  'stroke',
] as const;

type ColorPropNames = (typeof colorProps)[number];

export const stylers: ThemeStylerMap<ColorPropNames | 'catchAll'> = {
  ...colorProps.reduce(
    (colorStylers, propName) => ({
      ...colorStylers,
      [propName]: {
        resolver: 'color',
      } as ThemeStylerSettings<
        keyof (typeof formatters),
        keyof (typeof resolvers)
      >,
    }),
    {} as ThemeStylerMap<ColorPropNames>,
  ),
  catchAll: {
    resolver: 'themeKey',
  },
};
