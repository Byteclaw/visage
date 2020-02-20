import { resolvers } from '../resolvers';
import { ThemeFormatterAndResolverContext } from '../types';

describe('resolvers', () => {
  const ctx: ThemeFormatterAndResolverContext = {
    themeSettings: {
      colors: {
        array: [], // this throws
        scale: {
          values: ['#ccc', '#999', '#444'],
          offset: 1,
        },
        string: '#ccc',
      },
      fontFamily: {
        heading: 'Heading-font',
        body: 'Body-font',
      },
      arrayExtra: ['val'],
      nullExtra: null,
      undefinedExtra: undefined,
      scaleExtra: {
        values: ['0', '1', '2'],
        offset: 1,
      },
      borderRadius: {
        nullish: null,
        size: 1,
      },
      extra: 11,
    },
  } as any;

  describe('color', () => {
    it('resolves color against scale', () => {
      expect(resolvers.color('', 'scale', ctx, 0)).toEqual('#999');
      expect(resolvers.color('', 'scale.0', ctx, 0)).toEqual('#999');
      expect(resolvers.color('', 'scale.1', ctx, 0)).toEqual('#444');
      expect(resolvers.color('', 'scale.-1', ctx, 0)).toEqual('#ccc');
    });

    it('resolves color against string', () => {
      expect(resolvers.color('', 'string', ctx, 0)).toEqual('#ccc');
      expect(resolvers.color('', 'string.0', ctx, 0)).toEqual('#ccc');
      expect(resolvers.color('', 'string.-1', ctx, 0)).toEqual('#ccc');
      expect(resolvers.color('', 'string.1', ctx, 0)).toEqual('#ccc');
    });

    it('passes through color if there is no setting in the color palette', () => {
      expect(resolvers.color('', 'black', ctx, 0)).toEqual('black');
    });

    it('passes through empty value', () => {
      expect(resolvers.color('', null, ctx, 0)).toEqual(null);
    });
  });

  describe('fontFamily', () => {
    it('resolves to font specified in the palette', () => {
      expect(resolvers.fontFamily('', 'heading', ctx, 0)).toEqual(
        'Heading-font',
      );
      expect(resolvers.fontFamily('', 'body', ctx, 0)).toEqual('Body-font');
    });

    it('passes through font if there is no setting in font palette', () => {
      expect(resolvers.fontFamily('', 'extra', ctx, 0)).toEqual('extra');
    });

    it('passes through empty value', () => {
      expect(resolvers.fontFamily('', null, ctx, 0)).toEqual(null);
    });
  });

  describe('themeKey', () => {
    it('passes through empty value', () => {
      expect(resolvers.themeKey('', null, ctx, 0)).toEqual(null);
    });

    it('passes through value if the setting is missing', () => {
      expect(resolvers.themeKey('testProp', '10', ctx, 0)).toEqual('10');
    });

    it('passes through value if the setting is undefined', () => {
      expect(resolvers.themeKey('undefinedExtra', '10', ctx, 0)).toEqual('10');
    });

    it('returns null if value in the settings is null', () => {
      expect(resolvers.themeKey('nullExtra', '10', ctx, 0)).toEqual(null);
    });

    it('returns a non object value from theme as is', () => {
      expect(resolvers.themeKey('extra', '10', ctx, 0)).toEqual(11);
    });

    it('returns an array as is from the settings', () => {
      expect(resolvers.themeKey('arrayExtra', '10', ctx, 0)).toEqual(['val']);
    });

    it('returns a value from a scale theme setting', () => {
      expect(resolvers.themeKey('scaleExtra', '', ctx, 0)).toEqual('1');
      expect(resolvers.themeKey('scaleExtra', '-1', ctx, 0)).toEqual('0');
      expect(resolvers.themeKey('scaleExtra', '1', ctx, 0)).toEqual('2');
      expect(resolvers.themeKey('scaleExtra', '0', ctx, 0)).toEqual('1');
    });

    it('returns a value from nested theme setting', () => {
      expect(resolvers.themeKey('borderRadius', 'size', ctx, 0)).toEqual(1);
    });

    it('passes through value if missing in nested settings', () => {
      expect(resolvers.themeKey('borderRadius', 'missing', ctx, 0)).toEqual(
        'missing',
      );
    });

    it('returns a null if null in nested settings', () => {
      expect(resolvers.themeKey('borderRadius', 'nullish', ctx, 0)).toEqual(
        null,
      );
    });
  });
});
