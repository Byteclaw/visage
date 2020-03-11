import { createDocsTheme } from '@byteclaw/visage-themes';
import { add, complete, cycle, suite } from 'benny';
import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { renderToString } from 'react-dom/server';
import { DesignSystem, createComponent } from '../__tests__/designSystem';

const A = createComponent('div', {
  displayName: 'A',
  styles: {
    color: 'primary',
    m: 0,
  },
});
const B = createComponent('span', {
  displayName: 'B',
  styles: {
    color: 'primaryText',
    m: 1,
    p: 0,
  },
});
const C = createComponent(B, {
  displayName: 'A',
  styles: {
    color: 'primary',
    m: 0,
  },
});

const theme = createDocsTheme();

let rootAs: ReactTestRenderer;
let rootExtend: ReactTestRenderer;

const asTest = (
  <DesignSystem theme={theme}>
    <A as={B} />
  </DesignSystem>
);
const extendTest = (
  <DesignSystem theme={theme}>
    <A />
  </DesignSystem>
);
act(() => {
  rootAs = create(asTest);
});
act(() => {
  rootExtend = create(extendTest);
});

export const bench = suite(
  'as vs extend',
  add('as (test-renderer)', () => {
    act(() => {
      rootAs.update(
        <DesignSystem theme={theme}>
          <A as={B} />
        </DesignSystem>,
      );
    });
  }),
  add('as (renderToString)', () => {
    renderToString(
      <DesignSystem theme={theme}>
        <A as={B} />
      </DesignSystem>,
    );
  }),
  add('extend (test-renderer)', () => {
    act(() => {
      rootExtend.update(
        <DesignSystem theme={theme}>
          <C />
        </DesignSystem>,
      );
    });
  }),
  add('extend (renderToString)', () => {
    renderToString(
      <DesignSystem theme={theme}>
        <C />
      </DesignSystem>,
    );
  }),

  cycle(),
  complete(),
);
