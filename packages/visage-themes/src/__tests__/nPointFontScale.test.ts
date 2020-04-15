import { LRUCache } from '@byteclaw/visage-utils';
import { createNPointFontScaleTheme } from '..';

describe('NPoint font scale theme', () => {
  const theme = createNPointFontScaleTheme({
    fontSize: { values: [16, 17, 18], offset: 0 },
    lineHeights: { values: [20, 21, 22], offset: 0 },
    baseGridSize: 8,
    borderRadius: {
      controlBorderRadius: 4,
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
      warning: 'orange',
      warningText: 'white',
    },
    fontFamily: {
      body: 'bodyFont',
      heading: 'headingFont',
    },
  });

  const ctx = {
    breakpoint: 0,
    stylerCache: new LRUCache(100),
    ...theme,
  };

  describe('resolvers', () => {
    describe('boxShadow', () => {
      it('translates colors from palette to their values', () => {
        expect(
          theme.style('boxShadow', '0 0 0 danger, 0 1 0 info', ctx).styles
            .boxShadow,
        ).toEqual('0 0 0 rgb(255, 0, 0), 0 1 0 rgb(0, 0, 255)');
      });
    });

    describe('borderRadius', () => {
      it('works with names', () => {
        expect(
          theme.style('borderRadius', 'controlBorderRadius', ctx).styles
            .borderRadius,
        ).toEqual(4);
      });
    });
  });
});
