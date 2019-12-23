import { createNPointTheme, ratios } from '../createNPointTheme';

const theme = createNPointTheme({
  baseFontSize: 16,
  baseLineHeightRatio: 1.6,
  baselineGridSize: 4,
  controlBorderRadius: 10,
  fontScaleRatio: ratios.goldenSection,
  colors: {
    bodyText: 'black',
    primary: 'black',
    primaryText: 'white',
  },
  fontFamily: {
    body: 'font',
    heading: 'font',
  },
});

describe('createNPointTheme', () => {
  describe('resolve()', () => {
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

    it('resolves spacings correctly', () => {
      expect(theme.resolve('margin', 0, 0).value).toBe('0px');
      expect(theme.resolve('margin', 1, 0).value).toBe('4px');
      expect(theme.resolve('margin', 2, 0).value).toBe('8px');
      expect(theme.resolve('margin', -1, 0).value).toBe('-4px');
      expect(theme.resolve('margin', -2, 0).value).toBe('-8px');
    });

    it('resolves control border radius correctly', () => {
      expect(theme.resolve('controlBorderRadius', 0, 0).value).toBe(10);
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
