import { resolvers } from '../resolvers';
import { StylerSheetResolveContext } from '../../styleSheet';
import { createTheme } from '../createTheme';

describe('resolvers', () => {
  const theme = createTheme({
    theme: {
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
      faces: {},
      mixins: {},
    },
  });
  const ctx: StylerSheetResolveContext = {
    breakpoint: 0,
    ...theme,
  };

  describe('color', () => {
    it('resolves color against scale', () => {
      expect(resolvers.color('', 'scale', ctx)).toEqual('#999');
      expect(resolvers.color('', 'scale.0', ctx)).toEqual('#999');
      expect(resolvers.color('', 'scale.1', ctx)).toEqual('#444');
      expect(resolvers.color('', 'scale.-1', ctx)).toEqual('#ccc');
    });

    it('resolves color against string', () => {
      expect(resolvers.color('', 'string', ctx)).toEqual('#ccc');
      expect(resolvers.color('', 'string.0', ctx)).toEqual('#ccc');
      expect(resolvers.color('', 'string.-1', ctx)).toEqual('#ccc');
      expect(resolvers.color('', 'string.1', ctx)).toEqual('#ccc');
    });

    it('passes through color if there is no setting in the color palette', () => {
      expect(resolvers.color('', 'black', ctx)).toEqual('black');
    });

    it('passes through empty value', () => {
      expect(resolvers.color('', null, ctx)).toEqual(null);
    });
  });

  describe('fontFamily', () => {
    it('resolves to font specified in the palette', () => {
      expect(resolvers.themeKey('fontFamily', 'heading', ctx)).toEqual(
        'Heading-font',
      );
      expect(resolvers.themeKey('fontFamily', 'body', ctx)).toEqual(
        'Body-font',
      );
    });

    it('passes through font if there is no setting in font palette', () => {
      expect(resolvers.themeKey('fontFamily', 'extra', ctx)).toEqual('extra');
    });

    it('passes through empty value', () => {
      expect(resolvers.themeKey('fontFamily', null, ctx)).toEqual(null);
    });
  });

  describe('themeKey', () => {
    it('passes through empty value', () => {
      expect(resolvers.themeKey('', null, ctx)).toEqual(null);
    });

    it('passes through value if the setting is missing', () => {
      expect(resolvers.themeKey('testProp', '10', ctx)).toEqual('10');
    });

    it('passes through value if the setting is undefined', () => {
      expect(resolvers.themeKey('undefinedExtra', '10', ctx)).toEqual('10');
    });

    it('returns null if value in the settings is null', () => {
      expect(resolvers.themeKey('nullExtra', '10', ctx)).toEqual(null);
    });

    it('returns a non object value from theme as is', () => {
      expect(resolvers.themeKey('extra', '10', ctx)).toEqual(11);
    });

    it('returns an array as is from the settings', () => {
      expect(resolvers.themeKey('arrayExtra', '10', ctx)).toEqual(['val']);
    });

    it('returns a value from a scale theme setting', () => {
      expect(resolvers.themeKey('scaleExtra', '', ctx)).toEqual('1');
      expect(resolvers.themeKey('scaleExtra', '-1', ctx)).toEqual('0');
      expect(resolvers.themeKey('scaleExtra', '1', ctx)).toEqual('2');
      expect(resolvers.themeKey('scaleExtra', '0', ctx)).toEqual('1');
    });

    it('returns a value from nested theme setting', () => {
      expect(resolvers.themeKey('borderRadius', 'size', ctx)).toEqual(1);
    });

    it('passes through value if missing in nested settings', () => {
      expect(resolvers.themeKey('borderRadius', 'missing', ctx)).toEqual(
        'missing',
      );
    });

    it('returns a null if null in nested settings', () => {
      expect(resolvers.themeKey('borderRadius', 'nullish', ctx)).toEqual(null);
    });
  });
});
