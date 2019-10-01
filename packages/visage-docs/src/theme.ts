import color from 'color';
import { ScaleValue } from '@byteclaw/visage-utils';
import { createScaleTheme, ratios } from '@byteclaw/visage';

function generateScale<TKey extends string = string>(
  name: TKey,
  forColor: string,
  lightSteps: number = 0,
  darkSteps: number = 0,
): Record<TKey, ScaleValue<string>> {
  const col = color(forColor);
  const lghtns = col.lightness();
  const colors: string[] = [];

  for (let i = lightSteps; i > 0; --i) {
    colors.push(
      col
        .lightness(lghtns + (100 - lghtns) * ((1 / (lightSteps + 1)) * i))
        .rgb()
        .toString(),
    );
  }

  colors.push(col.hex().toString());

  for (let i = 1; i < darkSteps + 1; ++i) {
    colors.push(
      col
        .lightness(lghtns - lghtns * ((1 / (lightSteps + 1)) * i))
        .rgb()
        .toString(),
    );
  }

  return {
    [name]: {
      values: colors,
      offset: lightSteps,
    },
    [`${name}Text`]: {
      values: colors.map(bgColor =>
        color(bgColor).isDark() ? 'white' : 'black',
      ),
      offset: lightSteps,
    },
  } as Record<TKey, ScaleValue<string>>;
}

export const theme = createScaleTheme({
  fontSizes: { values: [10, 12, 14, 16, 20, 24, 28, 32, 40, 48], offset: 2 },
  lineHeights: { values: [18, 20, 22, 24, 28, 32, 36, 40, 48, 56], offset: 2 },
  baselineGridSize: 8,
  fontScaleRatio: ratios.perfectFourth,
  colors: {
    bodyText: 'black',
    dangerBodyText: 'red',
    ...generateScale<'danger' | 'dangerText'>('danger', 'red', 5, 5),
    ...generateScale<'info' | 'infoText'>('info', '#0099ff', 5, 5),
    ...generateScale<'neutral' | 'neutralText'>('neutral', '#ddd', 5, 5),
    ...generateScale<'primary' | 'primaryText'>('primary', '#000', 6),
    ...generateScale<'grey' | 'greyText'>('grey', '#999', 5, 5),
    ...generateScale<'success' | 'successText'>('success', '#99cc33', 5, 5),
    ...generateScale<'warning' | 'warningText'>('warning', '#ffcc00', 5, 5),
  },
  fontFamilies: {
    body: 'Open Sans,sans-serif',
    heading: 'Nunito Sans,sans-serif',
  },
});
