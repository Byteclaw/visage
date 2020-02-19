import { createNPointModularScaleTheme, modularScaleFontRatios } from '..';

describe('NPoint modular scale theme', () => {
  it('throws if baseFontSize is invalid', () => {
    expect(() =>
      createNPointModularScaleTheme({} as any),
    ).toThrowErrorMatchingInlineSnapshot(`"Please set up baseFontSize"`);

    expect(() =>
      createNPointModularScaleTheme({
        baseFontSize: [],
      } as any),
    ).toThrowErrorMatchingInlineSnapshot(`"Please set up baseFontSize"`);
  });

  const theme = createNPointModularScaleTheme({
    baseFontSize: 16,
    baseGridSize: 4,
    baseLineHeightRatio: 1.6,
    borderRadius: {
      controlBorderRadius: 10,
    },
    colors: {
      danger: 'red',
      dangerText: 'white',
      darkAccent: 'white',
      darkAccentText: 'black',
      darkShades: 'black',
      darkShadesText: 'white',
      info: 'blue',
      infoText: 'white',
      lightAccent: 'black',
      lightAccentText: 'white',
      lightShades: 'white',
      lightShadesText: 'black',
      neutral: 'grey',
      neutralText: 'white',
      primary: 'salmon',
      primaryText: 'white',
      success: 'green',
      successText: 'white',
      textInput: 'white',
      textInputBorder: 'black',
      warning: 'orange',
      warningText: 'white',
    },
    fontFamily: {
      body: 'bodyFont',
      heading: 'headingFont',
    },
    fontScaleRatio: modularScaleFontRatios.goldenSection,
  });

  describe('resolvers', () => {
    describe('boxShadow', () => {
      it('translates colors from palette to their values', () => {
        expect(
          theme.resolve('boxShadow', '0 0 0 danger, 0 1 0 info', 0),
        ).toEqual({
          properties: ['boxShadow'],
          value: '0 0 0 red, 0 1 0 blue',
        });
      });
    });

    describe('borderRadius', () => {
      it('works with names', () => {
        expect(theme.resolve('borderRadius', 'controlBorderRadius', 0)).toEqual(
          {
            properties: ['borderRadius'],
            value: 10,
          },
        );
      });
    });

    describe('fontSize', () => {
      it('resolves font size correctly', () => {
        expect(theme.resolve('fontSize', 0, 0).value).toBe('16px');
        expect(theme.resolve('fontSize', 1, 0).value).toBe('26px');
        expect(theme.resolve('fontSize', 2, 0).value).toBe('42px');
        expect(theme.resolve('fontSize', 3, 0).value).toBe('68px');
        expect(theme.resolve('fontSize', 4, 0).value).toBe('110px');
        expect(theme.resolve('fontSize', 5, 0).value).toBe('177px');
        expect(theme.resolve('fontSize', 6, 0).value).toBe('287px');
        expect(theme.resolve('fontSize', -1, 0).value).toBe('10px');
        expect(theme.resolve('fontSize', -2, 0).value).toBe('6px');
      });
    });

    describe('lineHeight', () => {
      it('resolves line height correctly', () => {
        expect(theme.resolve('lineHeight', 0, 0).value).toBe('24px');
        expect(theme.resolve('lineHeight', 1, 0).value).toBe('48px');
        expect(theme.resolve('lineHeight', 2, 0).value).toBe('48px');
        expect(theme.resolve('lineHeight', 3, 0).value).toBe('72px');
        expect(theme.resolve('lineHeight', 4, 0).value).toBe('120px');
        expect(theme.resolve('lineHeight', 5, 0).value).toBe('192px');
        expect(theme.resolve('lineHeight', 6, 0).value).toBe('288px');
        expect(theme.resolve('lineHeight', -1, 0).value).toBe('24px');
        expect(theme.resolve('lineHeight', -2, 0).value).toBe('24px');
      });
    });

    describe('spacings', () => {
      it('resolves spacings correctly', () => {
        expect(theme.resolve('margin', 0, 0).value).toBe('0px');
        expect(theme.resolve('margin', 1, 0).value).toBe('4px');
        expect(theme.resolve('margin', 2, 0).value).toBe('8px');
        expect(theme.resolve('margin', -1, 0).value).toBe('-4px');
        expect(theme.resolve('margin', -2, 0).value).toBe('-8px');
      });
    });

    it('resolves control border radius correctly', () => {
      expect(
        theme.resolve('borderRadius', 'controlBorderRadius', 0).value,
      ).toBe(10);

      expect(theme.resolve('borderRadius', '8px', 0).value).toBe('8px');

      expect(theme.resolve('borderRadius', 3, 0).value).toBe(3);
    });

    it.each([-2, -1, 0, 1, 2, 3, 4, 5, 6])(
      'resolves font size %d and line height %d correctly',
      (size: number) => {
        const fontSize = Number(
          theme.resolve('fontSize', size, 0).value.replace('px', ''),
        );
        const lineHeight = Number(
          theme.resolve('lineHeight', size, 0).value.replace('px', ''),
        );

        expect(fontSize).toBeLessThan(lineHeight);
      },
    );
  });
});
