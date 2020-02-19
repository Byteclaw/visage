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
    fontScaleRatio: 1.5,
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
            value: 4,
          },
        );
      });
    });
  });
});
