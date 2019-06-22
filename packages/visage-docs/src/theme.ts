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
  },
  fontFamilies: {
    body: 'Lato,serif',
    heading: 'Raleway,sans-serif',
  },
});
