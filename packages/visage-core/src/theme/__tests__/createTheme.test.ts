import { LRUCache } from '@byteclaw/visage-utils';
import { createTheme } from '../createTheme';
import { StylerResult, StylerResultType } from '../../styleSheet';

describe('createTheme', () => {
  describe('style', () => {
    it('caches value', () => {
      const themeKeyResolver = jest.fn((_: any, v: any) => v);
      const theme = createTheme({
        theme: {
          colors: {},
          fontFamily: {},
        },
        resolvers: {
          themeKey: themeKeyResolver as any,
        },
      });
      const cache = new LRUCache<string, StylerResult>();

      expect(
        theme.style('test', 10, {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toEqual({
        styles: { test: 10 },
        type: StylerResultType.inPlaceFinal,
      });

      expect(themeKeyResolver).toHaveBeenCalledTimes(1);

      expect(
        theme.style('test', 10, {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toEqual({
        styles: { test: 10 },
        type: StylerResultType.inPlaceFinal,
      });

      expect(themeKeyResolver).toHaveBeenCalledTimes(1);
    });
  });

  describe('color resolution', () => {
    it('allows to specify colors in theme using color function', () => {
      const theme = createTheme({
        theme: {
          colors: {
            primary: 'black',
            primaryText: 'color(primary, contrast())',
            cycle: 'color(cycle, contrast())',
            indirectCycle: 'color(cycle, contrast())',
            scale: {
              offset: 1,
              values: ['black', 'red', 'blue'],
            },
            scaleWithColor: {
              values: [
                'color(scale.-1, tint(10%))',
                'color(scale, tint(10%))',
                'color(scale.1, tint(10%))',
              ],
              offset: 1,
            },
            scaleWithCycle: {
              values: ['cycle'],
              offset: 0,
            },
          },
          fontFamily: {},
        },
      });
      const cache = new LRUCache<string, StylerResult>();

      expect(
        theme.resolve('color', 'primary', {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toBe('rgb(0, 0, 0)');

      expect(
        theme.resolve('color', 'primaryText', {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toBe('rgb(255, 255, 255)');

      expect(
        theme.resolve('color', 'cycle', {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toEqual('color(cycle, contrast())');
      expect(
        theme.resolve('color', 'indirectCycle', {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toEqual('color(cycle, contrast())');

      expect(
        theme.resolve('color', 'scale.1', {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toBe('rgb(0, 0, 255)');

      expect(
        theme.resolve('color', 'scaleWithColor.1', {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toBe('rgb(26, 26, 255)');

      expect(
        theme.resolve('color', 'scaleWithCycle.0', {
          ...theme,
          breakpoint: 0,
          stylerCache: cache,
        }),
      ).toEqual('color(cycle, contrast())');
    });
  });
});
