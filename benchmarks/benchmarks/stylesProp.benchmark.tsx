import { createComponent } from '@byteclaw/visage';
import { add, complete, cycle, suite } from 'benny';
import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { BenchmarkingDesignSystem } from './BenchmarkingDesignSystem';

const A = createComponent('div', {
  displayName: 'A',
  // turn off React.memo
  asMemo: false,
  styles: {
    color: 'blue',
  },
});
const AMemo = createComponent('div', {
  displayName: 'A',
  styles: {
    color: 'blue',
  },
});

let hoistedRenderer: ReactTestRenderer;
let hoistedMemoRenderer: ReactTestRenderer;
let unhoistedRenderer: ReactTestRenderer;
let unhoistedMemoRenderer: ReactTestRenderer;
const hoistedStyles = {
  backgroundColor: 'red',
  color: 'white',
};

act(() => {
  hoistedRenderer = create(
    <BenchmarkingDesignSystem>
      <A styles={hoistedStyles} />
    </BenchmarkingDesignSystem>,
  );
});

act(() => {
  unhoistedRenderer = create(
    <BenchmarkingDesignSystem>
      <A styles={{ backgroundColor: 'red', color: 'white' }} />
    </BenchmarkingDesignSystem>,
  );
});

act(() => {
  hoistedMemoRenderer = create(
    <BenchmarkingDesignSystem>
      <AMemo styles={hoistedStyles} />
    </BenchmarkingDesignSystem>,
  );
});

act(() => {
  unhoistedMemoRenderer = create(
    <BenchmarkingDesignSystem>
      <AMemo styles={{ backgroundColor: 'red', color: 'white' }} />
    </BenchmarkingDesignSystem>,
  );
});

export const bench = suite(
  'hoisted vs unhoisted style props',
  add('hoisted style prop', () => {
    act(() => {
      hoistedRenderer.update(
        <BenchmarkingDesignSystem>
          <A styles={hoistedStyles} />
        </BenchmarkingDesignSystem>,
      );
    });
  }),
  add('unhoisted style prop', () => {
    act(() => {
      unhoistedRenderer.update(
        <BenchmarkingDesignSystem>
          <A styles={{ backgroundColor: 'red', color: 'white' }} />
        </BenchmarkingDesignSystem>,
      );
    });
  }),
  add('hoisted style prop on memo component', () => {
    act(() => {
      hoistedMemoRenderer.update(
        <BenchmarkingDesignSystem>
          <AMemo styles={hoistedStyles} />
        </BenchmarkingDesignSystem>,
      );
    });
  }),
  add('unhoisted style prop on memo component', () => {
    act(() => {
      unhoistedMemoRenderer.update(
        <BenchmarkingDesignSystem>
          <AMemo styles={{ backgroundColor: 'red', color: 'white' }} />
        </BenchmarkingDesignSystem>,
      );
    });
  }),
  cycle(),
  complete(),
);
