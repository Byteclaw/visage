import { transformSync } from '@babel/core';
import * as fs from 'fs';
import * as path from 'path';
import { generate } from 'pegjs';
import tspegjs from 'ts-pegjs';

describe('box shadow parser', () => {
  // eslint-disable-next-line no-eval
  const parse = eval(
    transformSync(
      generate(
        fs.readFileSync(
          path.resolve(__dirname, '../../box-shadow-grammar.pegjs'),
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

  it('parses simple box shadow', () => {
    expect(parse('unset')).toEqual('unset');
    expect(parse('initial')).toEqual('initial');
    expect(parse('unset')).toEqual('unset');
    expect(parse('none')).toEqual('none');
    expect(parse('0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('0 0 #f00')).toEqual([{ color: '#f00' }]);
    expect(parse('0 0 #ff0000')).toEqual([{ color: '#ff0000' }]);
    expect(parse('inset 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset 0px 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('0px 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset 0px 0.0em red')).toEqual([{ color: 'red' }]);
    expect(parse('0px 0.0em red')).toEqual([{ color: 'red' }]);
    expect(parse('inset -0px .0em red')).toEqual([{ color: 'red' }]);
    expect(parse('-0px .0em red')).toEqual([{ color: 'red' }]);
    expect(parse('inset -0px .0em red.1')).toEqual([{ color: 'red.1' }]);
    expect(parse('-0px .0em red.1')).toEqual([{ color: 'red.1' }]);
    expect(parse('inset -0px .0em red.-1')).toEqual([{ color: 'red.-1' }]);
    expect(parse('-0px .0em red.-1')).toEqual([{ color: 'red.-1' }]);
    expect(parse('inset -0px .0em color(red alpha(0.2))')).toEqual([
      { color: 'color(red alpha(0.2))' },
    ]);
    expect(parse('-0px .0em color(red alpha(0.2))')).toEqual([
      { color: 'color(red alpha(0.2))' },
    ]);

    expect(parse('0 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset 0 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset 0px 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('0px 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset 0px 0.0em 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('0px 0.0em 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset -0px .0em 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('-0px .0em 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset -0px .0em 0 red.1')).toEqual([{ color: 'red.1' }]);
    expect(parse('-0px .0em 0 red.1')).toEqual([{ color: 'red.1' }]);
    expect(parse('inset -0px .0em 0 red.-1')).toEqual([{ color: 'red.-1' }]);
    expect(parse('-0px .0em 0 red.-1')).toEqual([{ color: 'red.-1' }]);
    expect(parse('inset -0px .0em 0 color(red alpha(0.2))')).toEqual([
      { color: 'color(red alpha(0.2))' },
    ]);
    expect(parse('-0px .0em 0 color(red alpha(0.2))')).toEqual([
      { color: 'color(red alpha(0.2))' },
    ]);

    expect(parse('0 0 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset 0 0 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset 0px 0 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('0px 0 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset 0px 0.0em 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('0px 0.0em 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset -0px .0em 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('-0px .0em 0 0 red')).toEqual([{ color: 'red' }]);
    expect(parse('inset -0px .0em 0 0 red.1')).toEqual([{ color: 'red.1' }]);
    expect(parse('-0px .0em 0 0 red.1')).toEqual([{ color: 'red.1' }]);
    expect(parse('inset -0px .0em 0 0 red.-1')).toEqual([{ color: 'red.-1' }]);
    expect(parse('-0px .0em 0 0 red.-1')).toEqual([{ color: 'red.-1' }]);
    expect(parse('inset -0px .0em 0 0 color(red alpha(0.2))')).toEqual([
      { color: 'color(red alpha(0.2))' },
    ]);
    expect(parse('-0px .0em 0 0 color(red alpha(0.2))')).toEqual([
      { color: 'color(red alpha(0.2))' },
    ]);
    expect(parse('inset -0px .0em 0 0 color(red contrast())')).toEqual([
      { color: 'color(red contrast())' },
    ]);
    expect(parse('-0px .0em 0 0 color(red contrast(20%))')).toEqual([
      { color: 'color(red contrast(20%))' },
    ]);
    expect(parse('-0px .0em 0 0 color(red ifDark(white))')).toEqual([
      { color: 'color(red ifDark(white))' },
    ]);
    expect(parse('-0px .0em 0 0 color(red if(isDark white))')).toEqual([
      { color: 'color(red if(isDark white))' },
    ]);
    expect(parse('-0px .0em 0 0 color(red if(isDark white black))')).toEqual([
      { color: 'color(red if(isDark white black))' },
    ]);
    expect(parse('-0px .0em 0 0 color(red blenda(white 10%))')).toEqual([
      { color: 'color(red blenda(white 10%))' },
    ]);
  });

  it('parses multiple box shadow', () => {
    expect(parse('0 0 red, 0 0 blue, inset 0px -1em black')).toEqual([
      { color: 'red' },
      { color: 'blue' },
      { color: 'black' },
    ]);
    expect(
      parse('0 0 0 4px rgba(255, 255, 255, 0.4), 0 0 0 4px accent'),
    ).toEqual([{ color: 'rgba(255, 255, 255, 0.4)' }, { color: 'accent' }]);
    expect(
      parse(
        '0px 2px 6px #AAA,0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px primary',
      ),
    ).toEqual([
      { color: '#AAA' },
      { color: 'rgba(255,255,255,0.4)' },
      { color: 'primary' },
    ]);
  });
});
