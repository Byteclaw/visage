import { getResponsiveValue } from '@byteclaw/visage-utils/src';
import {
  resolveStyleSheet,
  StylerResultType,
  StylerSheetResolveContext,
} from '..';
import { createTheme } from '../../theme';

const theme = createTheme({
  stylers: {
    mx(propName, value, c) {
      const resolvedValue = getResponsiveValue(c.breakpoint, value);

      return {
        type: StylerResultType.inPlace,
        styles: {
          marginLeft: resolvedValue,
          marginRight: resolvedValue,
        },
      };
    },
    preFinal(propName, value, c) {
      const resolvedValue = getResponsiveValue(c.breakpoint, value);

      return {
        type: StylerResultType.preFinal,
        styles: {
          [propName]: resolvedValue,
        },
      };
    },
  },
  theme: {
    colors: {
      primary: 'black',
    },
    fontFamily: {
      body: 'body',
      heading: 'heading',
    },
    faces: {
      testFace: {
        color: 'red',
        fontSize: 4,
      },
    },
    mixins: {
      testExtend: {
        backgroundColor: 'black',
        color: 'blue',
        fontSize: 3,
      },
    },
  },
});

const ctx: StylerSheetResolveContext = {
  breakpoint: 0,
  resolutionCache: new Map(),
  ...theme,
};

describe('StyleSheet', () => {
  describe('resolveStyleSheet', () => {
    describe('preFinal/postFinal stylers', () => {
      it('works correctly for simple value', () => {
        expect(
          JSON.stringify(
            resolveStyleSheet(
              {
                fontSize: 1,
                mx: 10,
                preFinal: 1,
              },
              ctx,
            ),
            null,
            '  ',
          ),
        ).toMatchInlineSnapshot(`
          "{
            \\"preFinal\\": 1,
            \\"fontSize\\": 1,
            \\"marginLeft\\": 10,
            \\"marginRight\\": 10
          }"
        `);
      });

      it('works correctly for nested style sheets', () => {
        expect(
          JSON.stringify(
            resolveStyleSheet(
              {
                fontSize: 1,
                preFinal: 1,
                '&:hover': {
                  fontSize: 2,
                  preFinal: 1,
                  '&:abwab': {
                    fontSize: 3,
                    preFinal: 1,
                  },
                },
              },
              ctx,
            ),
            null,
            '  ',
          ),
        ).toMatchInlineSnapshot(`
          "{
            \\"preFinal\\": 1,
            \\"fontSize\\": 1,
            \\"&:hover\\": {
              \\"preFinal\\": 1,
              \\"fontSize\\": 2,
              \\"&:abwab\\": {
                \\"preFinal\\": 1,
                \\"fontSize\\": 3
              }
            }
          }"
        `);
      });
    });

    describe('pre/post stylers', () => {
      it('works correctly for simple value', () => {
        expect(
          JSON.stringify(
            resolveStyleSheet(
              {
                fontSize: 1,
                preFinal: 1,
                face: 'testFace',
                extends: 'testExtend',
              },
              ctx,
            ),
            null,
            '  ',
          ),
        ).toMatchInlineSnapshot(`
          "{
            \\"preFinal\\": 1,
            \\"backgroundColor\\": \\"rgb(0, 0, 0)\\",
            \\"color\\": \\"rgb(255, 0, 0)\\",
            \\"fontSize\\": 4
          }"
        `);
      });

      it('works correctly for nested style sheets', () => {
        expect(
          JSON.stringify(
            resolveStyleSheet(
              {
                fontSize: 1,
                preFinal: 1,
                mx: 10,
                face: 'testFace',
                extends: 'testExtend',
                '&:hover': {
                  fontSize: 2,
                  preFinal: 1,
                  face: 'testFace',
                  extends: 'testExtend',
                  '&:abwab': {
                    fontSize: 3,
                    preFinal: 1,
                    face: 'testFace',
                    extends: 'testExtend',
                  },
                },
              },
              ctx,
            ),
            null,
            '  ',
          ),
        ).toMatchInlineSnapshot(`
          "{
            \\"preFinal\\": 1,
            \\"backgroundColor\\": \\"rgb(0, 0, 0)\\",
            \\"color\\": \\"rgb(255, 0, 0)\\",
            \\"fontSize\\": 4,
            \\"marginLeft\\": 10,
            \\"marginRight\\": 10,
            \\"&:hover\\": {
              \\"preFinal\\": 1,
              \\"backgroundColor\\": \\"rgb(0, 0, 0)\\",
              \\"color\\": \\"rgb(255, 0, 0)\\",
              \\"fontSize\\": 4,
              \\"&:abwab\\": {
                \\"preFinal\\": 1,
                \\"backgroundColor\\": \\"rgb(0, 0, 0)\\",
                \\"color\\": \\"rgb(255, 0, 0)\\",
                \\"fontSize\\": 4
              }
            }
          }"
        `);
      });
    });

    it('works correctly', () => {
      expect(
        resolveStyleSheet(
          {
            '*': {
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            },
            '*, *::before, *::after': {
              boxSizing: 'inherit',
              lineHeight: 0,
              // padding: '0.05px', // prevent margin collapsing between parent and child
            },
            body: {
              margin: 0,
              width: '100%',
              maxWidth: 'none',
            },
            html: {
              boxSizing: 'border-box',
              margin: 0,
              width: '100%',
              maxWidth: 'none',
              // https://github.com/matejlatin/Gutenberg/blob/master/src/style/layout/_base.scss#L22
              msTextSizeAdjust: '100%',
              webkitTextSizeAdjust: '100%',
              textSizeAdjust: '100%',
            },
          },
          ctx,
        ),
      ).toMatchInlineSnapshot(`
        Object {
          "*": Object {
            "MozOsxFontSmoothing": "grayscale",
            "WebkitFontSmoothing": "antialiased",
            "textRendering": "optimizeLegibility",
          },
          "*, *::before, *::after": Object {
            "boxSizing": "inherit",
            "lineHeight": 0,
          },
          "body": Object {
            "margin": 0,
            "maxWidth": "none",
            "width": "100%",
          },
          "html": Object {
            "boxSizing": "border-box",
            "margin": 0,
            "maxWidth": "none",
            "msTextSizeAdjust": "100%",
            "textSizeAdjust": "100%",
            "webkitTextSizeAdjust": "100%",
            "width": "100%",
          },
        }
      `);
    });
  });
});
