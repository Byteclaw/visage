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
  asMemo: false,
});

const theme = createDocsTheme();

let rootA: ReactTestRenderer;

const ATest = (
  <DesignSystem theme={theme}>
    <A />
  </DesignSystem>
);
act(() => {
  rootA = create(ATest);
});

export const bench = suite(
  'VisageComponent',
  add('test-renderer', () => {
    act(() => {
      rootA.update(
        <DesignSystem theme={theme}>
          <A />
        </DesignSystem>,
      );
    });
  }),
  add('renderToString', () => {
    renderToString(
      <DesignSystem theme={theme}>
        <A />
      </DesignSystem>,
    );
  }),

  cycle(),
  complete(),
);
