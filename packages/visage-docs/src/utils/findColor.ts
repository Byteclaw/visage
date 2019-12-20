import color from 'color';

function isContrastOk(foreground: color, background: color): boolean {
  const contrast = foreground.contrast(background);

  return contrast >= 4.5 && contrast <= 5.0;
}

export function findColor(source: string, background: string): string {
  const sourceColor = color(source);
  const backgroundColor = color(background);

  if (isContrastOk(sourceColor, backgroundColor)) {
    return sourceColor.string();
  }

  // reset source color
  for (let s = 100; s >= 0; s--) {
    for (let l = 0; l <= 100; l++) {
      const col = color()
        .hue(sourceColor.hue())
        .saturationl(s)
        .lightness(l);

      if (isContrastOk(col, backgroundColor)) {
        return col.string();
      }
    }
  }

  return sourceColor.string();
}
