import { render } from '@testing-library/react';
import React from 'react';
import { TestDesignSystem } from './TestDesignSystem';
import { GlobalStyles } from '../GlobalStyles';

describe('GlobalStyles', () => {
  it('resolves StyleSheet and applies global styles', () => {
    const { asFragment } = render(
      <TestDesignSystem>
        <GlobalStyles styles={{ body: { fontFamily: 'body', fontSize: 1 } }} />
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`<DocumentFragment />`);
    expect(getComputedStyle(document.body)).toMatchInlineSnapshot(`
CSSStyleDeclaration {
  "0": "display",
  "1": "margin",
  "2": "font-family",
  "3": "font-size",
  "4": "visibility",
  "_importants": Object {
    "display": "",
    "font-family": "",
    "font-size": "",
    "margin": "",
    "visibility": undefined,
  },
  "_length": 5,
  "_onChange": [Function],
  "_values": Object {
    "display": "block",
    "font-family": "body-font",
    "font-size": "26px",
    "margin": "8px",
    "margin-bottom": "8px",
    "margin-left": "8px",
    "margin-right": "8px",
    "margin-top": "8px",
    "visibility": "visible",
  },
}
`);
  });
});
