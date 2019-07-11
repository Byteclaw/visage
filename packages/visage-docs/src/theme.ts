import color from 'color';
import { createNPointTheme, ratios } from '@byteclaw/visage';

export const theme = createNPointTheme({
  baseFontSize: 16,
  baseLineHeightRatio: 1.6,
  baselineGridSize: 8,
  fontScaleRatio: ratios.perfectFourth,
  colors: {
    bodyText: '#444',
    primary: {
      values: [
        '#000000',
        color('#000000')
          .fade(0.1)
          .hex()
          .toString(),
        color('#000000')
          .fade(0.2)
          .hex()
          .toString(),
        color('#000000')
          .fade(0.3)
          .rgb()
          .string(),
      ],
      offset: 0,
    },
    primaryText: 'white',
    grey: {
      values: [
        '#ffffff',
        '#e6e6e6',
        '#cccccc',
        '#b3b3b3',
        '#999999',
        '#808080',
        '#666666',
        '#4d4d4d',
        '#333333',
        '#1a1a1a',
        '#000000',
      ],
      offset: 0,
    },
  },
  fontFamilies: {
    body: 'Lato,serif',
    heading: 'Raleway,sans-serif',
  },
});
