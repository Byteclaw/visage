import { cache } from 'emotion';
import {
  createNPointModularScaleTheme,
  modularScaleFontRatios,
} from '@byteclaw/visage-themes';
import { createResponsiveEmotionStyleGenerator } from '../emotionResponsiveStyleGenerator';

const MOBILE_BP = `only screen`; // 40em
const TABLET_BP = `screen and (min-width: ${641 / 16}em)`; // 40.0625em
const DESKTOP_BP = `screen and (min-width: ${1025 / 16}em)`; // 64.036em

const defaultBreakpoints = [MOBILE_BP, TABLET_BP, DESKTOP_BP];

const styleGenerator = createResponsiveEmotionStyleGenerator(
  defaultBreakpoints,
);

describe('emotion responsive style generator', () => {
  it('works correctly', () => {
    const theme = createNPointModularScaleTheme({
      baseFontSize: 16,
      baseLineHeightRatio: 1.5,
      baseGridSize: 8,
      colors: {
        primary: 'tomato',
        danger: 'red',
        success: 'green',
        darkAccent: 'blue',
        lightAccent: 'white',
        lightShades: 'white',
        darkShades: 'black',
        info: 'blue',
        warning: 'orange',
      },
      fontFamily: {
        body: 'Body font',
        heading: 'Heading font',
      },
      fontScaleRatio: modularScaleFontRatios.perfectFourth,
    });

    const styleSheet = {
      color: 'primary',
      fontFamily: 'body',
      fontSize: [1, 2, 3, 4],
      margin: [2, 3, 4],
    };

    const mobile = styleGenerator([styleSheet], { breakpoint: 0, ...theme });
    const tablet = styleGenerator([styleSheet], { breakpoint: 1, ...theme });
    const desktop = styleGenerator([styleSheet], { breakpoint: 2, ...theme });

    expect(mobile).toMatchObject({
      className: expect.any(String),
    });
    expect(tablet).toMatchObject({
      className: expect.any(String),
    });
    expect(desktop).toMatchObject({
      className: expect.any(String),
    });

    expect(mobile.className).toEqual(tablet.className);
    expect(tablet.className).toEqual(desktop.className);

    expect(cache.registered[mobile.className]).toMatchInlineSnapshot(
      `"@media only screen{color:tomato;font-family:Body font;font-size:21px;margin:16px;}@media screen and (min-width: 40.0625em){color:tomato;font-family:Body font;font-size:28px;margin:24px;}@media screen and (min-width: 64.0625em){color:tomato;font-family:Body font;font-size:38px;margin:32px;}"`,
    );
  });
});
