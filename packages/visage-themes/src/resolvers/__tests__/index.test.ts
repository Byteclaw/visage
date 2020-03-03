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

      expect(theme.resolve('boxShadow', 'd', 0)).toEqual({
        properties: ['boxShadow'],
        value: 'd',
      });
    });

    it('passes through if there is no value in theme', () => {
      expect(themeWithShadow.resolve('boxShadow', 'c', 0)).toEqual({
        properties: ['boxShadow'],
        value: 'c',
      });
    });

    it('resolves against theme and resolves colors too', () => {
      expect(themeWithShadow.resolve('boxShadow', 'a', 0)).toEqual({
        properties: ['boxShadow'],
        value: 'a shadow',
      });
      expect(themeWithShadow.resolve('boxShadow', 'b', 0)).toEqual({
        properties: ['boxShadow'],
        value: 'b shadow #ccc',
      });
    });
  });
});
