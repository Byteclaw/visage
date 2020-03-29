import { createComponent } from '@byteclaw/visage';
import { add, complete, cycle, suite } from 'benny';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { BenchmarkingDesignSystem } from './BenchmarkingDesignSystem';

const A = createComponent('div', {
  displayName: 'A',
  styles: {
    color: 'blue',
  },
});

export const bench = suite(
  'initial render',
  add('visage component', () => {
    act(() => {
      create(
        <BenchmarkingDesignSystem>
          <A />
        </BenchmarkingDesignSystem>,
      );
    });
  }),
  add('html element', () => {
    act(() => {
      create(
        <BenchmarkingDesignSystem>
          <div style={{ color: 'blue' }} />
        </BenchmarkingDesignSystem>,
      );
    });
  }),
  cycle(),
  complete(),
);
