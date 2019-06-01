import { createNPointTheme, ratios } from '../createNPointTheme';

const create4ptTheme = createNPointTheme({
  baseFontSize: 16,
  baseLineHeightRatio: 1.6,
  baselineGridSize: 4,
  fontScaleRatio: ratios.goldenSection,
  colors: {
    bodyText: 'black',
    primary: 'black',
    primaryText: 'white',
  },
  fontFamilies: {
    body: 'font',
    heading: 'font',
  },
});

describe('createNPointTheme', () => {
  describe('breakpoint()', () => {
    it('returns current breakpoint', () => {
      let theme = create4ptTheme(1);

      expect(theme.breakpoint()).toBe(1);
      theme = create4ptTheme(2);
      expect(theme.breakpoint()).toBe(2);
    });
  });

  describe('resolve()', () => {
    const theme = create4ptTheme(0);

    it('resolves font size correctly', () => {
      expect(theme.resolve('fontSize', 0, undefined, {}, {})).toBe('16px');
      expect(theme.resolve('fontSize', 1, undefined, {}, {})).toBe('26px');
      expect(theme.resolve('fontSize', 2, undefined, {}, {})).toBe('42px');
      expect(theme.resolve('fontSize', 3, undefined, {}, {})).toBe('68px');
      expect(theme.resolve('fontSize', 4, undefined, {}, {})).toBe('110px');
      expect(theme.resolve('fontSize', 5, undefined, {}, {})).toBe('177px');
      expect(theme.resolve('fontSize', 6, undefined, {}, {})).toBe('287px');
      expect(theme.resolve('fontSize', -1, undefined, {}, {})).toBe('10px');
      expect(theme.resolve('fontSize', -2, undefined, {}, {})).toBe('6px');
    });

    it('resolves line height correctly', () => {
      expect(theme.resolve('lineHeight', 0, undefined, {}, {})).toBe('24px');
      expect(theme.resolve('lineHeight', 1, undefined, {}, {})).toBe('48px');
      expect(theme.resolve('lineHeight', 2, undefined, {}, {})).toBe('48px');
      expect(theme.resolve('lineHeight', 3, undefined, {}, {})).toBe('72px');
      expect(theme.resolve('lineHeight', 4, undefined, {}, {})).toBe('120px');
      expect(theme.resolve('lineHeight', 5, undefined, {}, {})).toBe('192px');
      expect(theme.resolve('lineHeight', 6, undefined, {}, {})).toBe('288px');
      expect(theme.resolve('lineHeight', -1, undefined, {}, {})).toBe('24px');
      expect(theme.resolve('lineHeight', -2, undefined, {}, {})).toBe('24px');
    });

    it('resolves spacings correctly', () => {
      expect(theme.resolve('margin', 0, undefined, {}, {})).toBe(0);
      expect(theme.resolve('margin', 1, undefined, {}, {})).toBe(4);
      expect(theme.resolve('margin', 2, undefined, {}, {})).toBe(8);
      expect(theme.resolve('margin', -1, undefined, {}, {})).toBe(-4);
      expect(theme.resolve('margin', -2, undefined, {}, {})).toBe(-8);
    });

    it.each([-2, -1, 0, 1, 2, 3, 4, 5, 6])(
      'resolves font size %d and line height %d correctly',
      (size: number) => {
        const fontSize = Number(
          theme
            .resolve('fontSize', size, 0, undefined, {}, {})
            .replace('px', ''),
        );
        const lineHeight = Number(
          theme
            .resolve('lineHeight', size, 0, undefined, {}, {})
            .replace('px', ''),
        );

        expect(fontSize).toBeLessThan(lineHeight);
      },
    );
  });
});
