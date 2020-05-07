import { createTheme } from '@byteclaw/visage-core';
import { LRUCache } from '@byteclaw/visage-utils';
import { stylers } from '../../stylers';
import * as resolvers from '..';

describe('resolvers', () => {
  describe('boxShadow', () => {
    const themeWithShadow = createTheme<any, 'boxShadow'>({
      resolvers,
      theme: {
        boxShadow: {
          a: '0 0 0 primary',
          b: 'inset 0 0 primary',
        },
        colors: {
          primary: '#ccc',
        },
        fontFamily: {},
      },
      stylers,
    });

    it('passes through if there are no boxShadow settings in theme', () => {
      const theme = createTheme<any, 'boxShadow'>({
        resolvers,
        theme: {
          colors: {
            primary: '#ccc',
          },
          fontFamily: {},
        },
        stylers,
      });

      expect(
        theme.resolve('boxShadow', '0 0 0 black', {
          breakpoint: 0,
          stylerCache: new LRUCache(),
          ...theme,
        }),
      ).toEqual('0 0 0 rgb(0, 0, 0)');
    });

    it('passes through if there is no value in theme', () => {
      expect(
        themeWithShadow.resolve('boxShadow', 'inset 0 0 white', {
          breakpoint: 0,
          stylerCache: new LRUCache(),
          ...themeWithShadow,
        }),
      ).toEqual('inset 0 0 rgb(255, 255, 255)');
    });

    it('resolves against theme and resolves colors too', () => {
      expect(
        themeWithShadow.resolve('boxShadow', 'a', {
          breakpoint: 0,
          stylerCache: new LRUCache(),
          ...themeWithShadow,
        }),
      ).toEqual('0 0 0 rgb(204, 204, 204)');
      expect(
        themeWithShadow.resolve('boxShadow', 'b', {
          breakpoint: 0,
          stylerCache: new LRUCache(),
          ...themeWithShadow,
        }),
      ).toEqual('inset 0 0 rgb(204, 204, 204)');
    });
  });
});
