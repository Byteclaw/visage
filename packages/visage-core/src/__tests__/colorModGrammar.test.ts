import { transformSync } from '@babel/core';
import color from 'color';
import * as fs from 'fs';
import * as path from 'path';
import { generate } from 'pegjs';
import tspegjs from 'ts-pegjs';
import { createTheme } from '../theme';

describe('color() parser', () => {
  const theme = createTheme({
    theme: {
      colors: {
        primary: {
          values: ['#ddd', '#ccc', '#bbb'],
          offset: 1,
        },
      },
    } as any,
  });
  // eslint-disable-next-line no-eval
  const parse = eval(
    transformSync(
      generate(
        fs.readFileSync(
          path.resolve(__dirname, '../../color-mod-grammar.pegjs'),
          {
            encoding: 'utf8',
          },
        ),
        {
          output: 'source',
          plugins: [tspegjs],
        },
      ),
      {
        filename: 'parser.ts',
      },
    ).code,
  );

  it('resolves hex color', () => {
    expect(parse('#000')(theme, color)).toEqual('rgb(0, 0, 0)');
    expect(parse('#ffffff')(theme, color)).toEqual('rgb(255, 255, 255)');
  });

  it('resolves rgb and rgba', () => {
    expect(parse('rgb(100, 200, 100)')(theme, color)).toEqual(
      'rgb(100, 200, 100)',
    );
    expect(parse('rgba(100 200 100 0.4)')(theme, color)).toEqual(
      'rgba(100, 200, 100, 0.4)',
    );
  });

  it('resolves hsl and hsla', () => {
    expect(parse('hsl(100 50% 50%)')(theme, color)).toEqual(
      'rgb(106, 191, 64)',
    );
    expect(parse('hsla(100 50% 50% 0.4)')(theme, color)).toEqual(
      'rgba(106, 191, 64, 0.4)',
    );
  });

  it('resolves theme color', () => {
    expect(parse('primary')(theme, color)).toEqual('rgb(204, 204, 204)');
    expect(parse('primary.0')(theme, color)).toEqual('rgb(204, 204, 204)');
    expect(parse('primary.1')(theme, color)).toEqual('rgb(187, 187, 187)');
    expect(parse('primary.-1')(theme, color)).toEqual('rgb(221, 221, 221)');
  });

  it('throws if color is not valid', () => {
    expect(() => parse('asis')(theme, color)).toThrow(
      'Unable to parse color from string: asis',
    );
  });

  it('resolves color() against hex', () => {
    expect(parse('color(#fff)')(theme, color)).toEqual('rgb(255, 255, 255)');
  });

  it('resolves color() against theme color', () => {
    expect(parse('color(primary)')(theme, color)).toEqual('rgb(204, 204, 204)');
  });

  it.each(['alpha', 'a'])('works with alpha (%s())', (fn: string) => {
    expect(parse(`color(#ccc ${fn}(50%))`)(theme, color)).toEqual(
      'rgba(204, 204, 204, 0.5)',
    );
    expect(parse(`color(#ccc ${fn}(0.5))`)(theme, color)).toEqual(
      'rgba(204, 204, 204, 0.5)',
    );
    expect(parse(`color(#ccc ${fn}(+25%))`)(theme, color)).toEqual(
      'rgb(204, 204, 204)',
    );
    expect(parse(`color(#ccc ${fn}(+0.25))`)(theme, color)).toEqual(
      'rgb(204, 204, 204)',
    );
    expect(parse(`color(#ccc ${fn}(-25%))`)(theme, color)).toEqual(
      'rgba(204, 204, 204, 0.75)',
    );
    expect(parse(`color(#ccc ${fn}(-0.25))`)(theme, color)).toEqual(
      'rgba(204, 204, 204, 0.75)',
    );
    expect(
      parse(`color(rgba(200, 200, 200, 0.5) ${fn}(20%))`)(theme, color),
    ).toEqual('rgba(200, 200, 200, 0.2)');
    expect(
      parse(`color(rgba(200, 200, 200, 0.5) ${fn}(+25%))`)(theme, color),
    ).toEqual('rgba(200, 200, 200, 0.75)');
    expect(
      parse(`color(rgba(200, 200, 200, 0.5) ${fn}(-25%))`)(theme, color),
    ).toEqual('rgba(200, 200, 200, 0.25)');
  });

  it.each(['hue', 'h'])('works with hue (%s())', (fn: string) => {
    expect(parse(`color(hsl(100, 50%, 50%) ${fn}(10))`)(theme, color)).toEqual(
      'rgb(191, 85, 64)',
    ); // hsl(10, 50%, 50%)
    expect(parse(`color(hsl(100, 50%, 50%) ${fn}(+10))`)(theme, color)).toEqual(
      'rgb(85, 191, 64)',
    ); // hsl(110, 50%, 50%)
    expect(parse(`color(hsl(100, 50%, 50%) ${fn}(-10))`)(theme, color)).toEqual(
      'rgb(128, 191, 64)',
    ); // hsl(90, 50%, 50%)
  });

  it('works with tint', () => {
    expect(parse('color(#ff0000 tint(50%))')(theme, color)).toEqual(
      'rgb(255, 128, 128)',
    );
  });

  it('works with shade', () => {
    expect(parse('color(#ff0000 shade(50%))')(theme, color)).toEqual(
      'rgb(128, 0, 0)',
    );
  });

  it.each(['saturation', 's'])('works with saturation (%s())', (fn: string) => {
    expect(parse(`color(hsl(100, 50%, 50%) ${fn}(25%))`)(theme, color)).toEqual(
      'rgb(117, 159, 96)',
    ); // hsl(100, 25%, 50%)
    expect(
      parse(`color(hsl(100, 50%, 50%) ${fn}(+25%))`)(theme, color),
    ).toEqual('rgb(96, 223, 32)'); // hsl(100, 75%, 50%)
    expect(
      parse(`color(hsl(100, 50%, 50%) ${fn}(-25%))`)(theme, color),
    ).toEqual('rgb(117, 159, 96)'); // hsl(100, 25%, 50%)
  });

  it.each(['lightness', 'l'])('works with lightness (%s())', (fn: string) => {
    expect(parse(`color(hsl(100, 50%, 50%) ${fn}(25%))`)(theme, color)).toEqual(
      'rgb(53, 96, 32)',
    ); // hsl(100, 50%, 25%)
    expect(
      parse(`color(hsl(100, 50%, 50%) ${fn}(+25%))`)(theme, color),
    ).toEqual('rgb(181, 223, 159)'); // hsl(100, 50%, 75%)
    expect(
      parse(`color(hsl(100, 50%, 50%) ${fn}(-25%))`)(theme, color),
    ).toEqual('rgb(53, 96, 32)'); // hsl(100, 50%, 25%)
  });

  it.each(['whiteness', 'w'])('works with whiteness (%s())', (fn: string) => {
    expect(parse(`color(hsl(100, 50%, 50%) ${fn}(50%))`)(theme, color)).toEqual(
      'rgb(149, 191, 128)',
    );
    expect(
      parse(`color(hsl(100, 50%, 50%) ${fn}(+20%))`)(theme, color),
    ).toEqual('rgb(140, 191, 115)');
    expect(
      parse(`color(hsl(100, 50%, 50%) ${fn}(-20%))`)(theme, color),
    ).toEqual('rgb(72, 191, 13)');
  });

  it.each(['blackness', 'b'])('works with blackness (%s())', (fn: string) => {
    expect(parse(`color(hsl(100, 50%, 50%) ${fn}(50%))`)(theme, color)).toEqual(
      'rgb(85, 128, 64)',
    );
    expect(
      parse(`color(hsl(100, 50%, 50%) ${fn}(+25%))`)(theme, color),
    ).toEqual('rgb(85, 128, 64)');
    expect(
      parse(`color(hsl(100, 50%, 50%) ${fn}(-25%))`)(theme, color),
    ).toEqual('rgb(128, 255, 64)');
  });

  it('works with contrast', () => {
    expect(parse('color(#ff0000 contrast())')(theme, color)).toEqual(
      'rgb(255, 255, 255)',
    );
    expect(parse('color(#000000 contrast())')(theme, color)).toEqual(
      'rgb(255, 255, 255)',
    );
    expect(parse('color(#000000 contrast(0%))')(theme, color)).toEqual(
      'rgb(118, 118, 118)',
    );
    expect(parse('color(#ccc contrast(100%))')(theme, color)).toEqual(
      'rgb(0, 0, 0)',
    );
    expect(parse('color(#000 contrast(100%))')(theme, color)).toEqual(
      'rgb(255, 255, 255)',
    );
  });

  it('works with blend and blenda', () => {
    expect(parse('color(aqua blend(white 20%))')(theme, color)).toEqual(
      'rgb(51, 255, 255)',
    );
    expect(parse('color(aqua blend(black 20%))')(theme, color)).toEqual(
      'rgb(0, 204, 204)',
    );
  });

  it('supports if clause', () => {
    expect(parse('color(black if(isDark white))')(theme, color)).toEqual(
      'rgb(255, 255, 255)',
    );
    expect(parse('color(white if(isDark white black))')(theme, color)).toEqual(
      'rgb(0, 0, 0)',
    );
    expect(
      parse('color(black if(isDark color(black tint(10%))))')(theme, color),
    ).toEqual('rgb(26, 26, 26)');
    expect(
      parse(
        'color(white if(isDark color(black tint(10%)) color(white shade(10%))))',
      )(theme, color),
    ).toEqual('rgb(230, 230, 230)');
  });
});
