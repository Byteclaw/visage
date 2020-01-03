import { cache } from 'emotion';
import { createEmotionStyleGenerator } from '../emotionStyleGenerator';
import { createNPointTheme, ratios } from '../createNPointTheme';

const styleGenerator = createEmotionStyleGenerator();

describe('emotion style generator', () => {
  it('works correctly', () => {
    const theme = createNPointTheme({
      baseFontSize: 16,
      baseLineHeightRatio: 1.5,
      baselineGridSize: 8,
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
      fontScaleRatio: ratios.perfectFourth,
    });

    const styleSheet = {
      color: 'primary',
      fontFamily: 'body',
      fontSize: [1, 2, 3, 4],
      margin: [2, 3, 4],
    };

    const mobile = styleGenerator(styleSheet, 0, theme);
    const tablet = styleGenerator(styleSheet, 1, theme);
    const desktop = styleGenerator(styleSheet, 2, theme);

    expect(mobile).toMatchObject({
      className: expect.any(String),
    });
    expect(tablet).toMatchObject({
      className: expect.any(String),
    });
    expect(desktop).toMatchObject({
      className: expect.any(String),
    });

    expect(mobile.className).not.toEqual(tablet.className);
    expect(tablet.className).not.toEqual(desktop.className);

    expect(cache.registered[mobile.className]).toMatchInlineSnapshot(
      `"color:tomato;font-family:Body font;font-size:21px;margin:16px;"`,
    );
    expect(cache.registered[tablet.className]).toMatchInlineSnapshot(
      `"color:tomato;font-family:Body font;font-size:28px;margin:24px;"`,
    );
    expect(cache.registered[desktop.className]).toMatchInlineSnapshot(
      `"color:tomato;font-family:Body font;font-size:38px;margin:32px;"`,
    );
  });
});
