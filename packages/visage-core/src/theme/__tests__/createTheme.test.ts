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
});
