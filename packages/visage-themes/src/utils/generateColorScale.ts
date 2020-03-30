import { ScaleValue } from '@byteclaw/visage-utils';
import color from 'color';

export function generateColorScale<TKey extends string = string>(
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

  colors.push(col.rgb().toString());

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
