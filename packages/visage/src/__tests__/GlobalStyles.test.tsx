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

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        .emotion-0 {
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 600;
      }

      <div
          aria-live="polite"
          class="emotion-0"
          data-toastmanager="true"
        />
      </DocumentFragment>
    `);
    expect(getComputedStyle(document.body)).toMatchInlineSnapshot(`
      CSSStyleDeclaration {
        "0": "display",
        "1": "margin",
        "2": "text-rendering",
        "3": "box-sizing",
        "4": "width",
        "5": "max-width",
        "6": "background-color",
        "7": "font-family",
        "8": "font-size",
        "_importants": Object {
          "background-color": "",
          "box-sizing": "",
          "display": "",
          "font-family": "",
          "font-size": "",
          "margin": "",
          "max-width": "",
          "text-rendering": "",
          "width": "",
        },
        "_length": 9,
        "_onChange": [Function],
        "_values": Object {
          "background-color": "rgb(204, 204, 204)",
          "box-sizing": "inherit",
          "display": "block",
          "font-family": "sans-serif",
          "font-size": "26px",
          "margin": "0px",
          "margin-bottom": "0px",
          "margin-left": "0px",
          "margin-right": "0px",
          "margin-top": "0px",
          "max-width": "none",
          "text-rendering": "optimizeLegibility",
          "width": "100%",
        },
      }
    `);
  });
});
