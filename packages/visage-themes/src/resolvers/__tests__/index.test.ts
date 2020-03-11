import { createTheme } from '@byteclaw/visage-core';
import { stylers } from '../../stylers';
import * as resolvers from '..';

describe('resolvers', () => {
  describe('boxShadow', () => {
    const themeWithShadow = createTheme<any, 'boxShadow'>({
      resolvers,
      theme: {
        boxShadow: {
          a: 'a shadow',
          b: 'b shadow primary',
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
        theme.resolve('boxShadow', 'd', { breakpoint: 0, ...theme }),
      ).toEqual('d');
    });

    it('passes through if there is no value in theme', () => {
      expect(
        themeWithShadow.resolve('boxShadow', 'c', {
          breakpoint: 0,
          ...themeWithShadow,
        }),
      ).toEqual('c');
    });

    it('resolves against theme and resolves colors too', () => {
      expect(
        themeWithShadow.resolve('boxShadow', 'a', {
          breakpoint: 0,
          ...themeWithShadow,
        }),
      ).toEqual('a shadow');
      expect(
        themeWithShadow.resolve('boxShadow', 'b', {
          breakpoint: 0,
          ...themeWithShadow,
        }),
      ).toEqual('b shadow #ccc');
    });
  });
});
