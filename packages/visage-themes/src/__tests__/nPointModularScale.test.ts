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
      info: 'blue',
      infoText: 'white',
      accent: 'black',
      accentText: 'white',
      shades: 'white',
      shadesText: 'black',
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
  const ctx = {
    breakpoint: 0,
    ...theme,
  };

  describe('resolvers', () => {
    describe('boxShadow', () => {
      it('translates colors from palette to their values', () => {
        expect(
          theme.resolve('boxShadow', '0 0 0 danger, 0 1 0 info', ctx),
        ).toEqual('0 0 0 red, 0 1 0 blue');
      });
    });

    describe('borderRadius', () => {
      it('works with names', () => {
        expect(
          theme.resolve('borderRadius', 'controlBorderRadius', ctx),
        ).toEqual(10);
      });
    });

    describe('fontSize', () => {
      it('resolves font size correctly', () => {
        expect(theme.style('fontSize', 0, ctx).styles.fontSize).toBe('16px');
        expect(theme.style('fontSize', 1, ctx).styles.fontSize).toBe('26px');
        expect(theme.style('fontSize', 2, ctx).styles.fontSize).toBe('42px');
        expect(theme.style('fontSize', -1, ctx).styles.fontSize).toBe('10px');
        expect(theme.style('fontSize', -2, ctx).styles.fontSize).toBe('6px');
      });
    });

    describe('lineHeight', () => {
      it('resolves line height correctly', () => {
        expect(theme.style('lineHeight', 0, ctx).styles.lineHeight).toBe(
          '24px',
        );
        expect(theme.style('lineHeight', 1, ctx).styles.lineHeight).toBe(
          '48px',
        );
        expect(theme.style('lineHeight', 2, ctx).styles.lineHeight).toBe(
          '48px',
        );
        expect(theme.style('lineHeight', 3, ctx).styles.lineHeight).toBe(
          '72px',
        );
        expect(theme.style('lineHeight', -1, ctx).styles.lineHeight).toBe(
          '24px',
        );
        expect(theme.style('lineHeight', -2, ctx).styles.lineHeight).toBe(
          '24px',
        );
      });
    });

    describe('spacings', () => {
      it('resolves spacings correctly', () => {
        expect(theme.style('margin', 0, ctx).styles.margin).toBe('0px');
        expect(theme.style('margin', 1, ctx).styles.margin).toBe('4px');
        expect(theme.style('margin', 2, ctx).styles.margin).toBe('8px');
        expect(theme.style('margin', -1, ctx).styles.margin).toBe('-4px');
        expect(theme.style('margin', -2, ctx).styles.margin).toBe('-8px');
      });
    });

    it('resolves control border radius correctly', () => {
      expect(
        theme.style('borderRadius', 'controlBorderRadius', ctx).styles
          .borderRadius,
      ).toBe(10);

      expect(theme.style('borderRadius', '8px', ctx).styles.borderRadius).toBe(
        '8px',
      );

      expect(theme.style('borderRadius', 3, ctx).styles.borderRadius).toBe(3);
    });

    it.each([-2, -1, 0, 1, 2, 3, 4, 5, 6])(
      'resolves font size %d and line height %d correctly',
      (size: number) => {
        const fontSize = Number(
          theme.style('fontSize', size, ctx).styles.fontSize.replace('px', ''),
        );
        const lineHeight = Number(
          theme
            .style('lineHeight', size, ctx)
            .styles.lineHeight.replace('px', ''),
        );

        expect(fontSize).toBeLessThan(lineHeight);
      },
    );
  });
});
