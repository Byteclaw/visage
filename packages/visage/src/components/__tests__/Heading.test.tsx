import React from 'react';
import { Heading } from '../Heading';
import { render } from './render';

describe('Heading', () => {
  it('renders as h1 by default', () => {
    const { asFragment } = render(<Heading>H1</Heading>);

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
        .emotion-0 {
        font-family: serif;
        font-size: 429px;
        font-weight: normal;
        line-height: 432px;
        margin-top: 16px;
        margin-bottom: 8px;
      }

      <h1
          class="emotion-0"
          data-level="1"
        >
          H1
        </h1>
      </DocumentFragment>
    `);
  });

  it('determines host component based on level', () => {
    const { asFragment } = render(<Heading level={3}>H3</Heading>);

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
        .emotion-0 {
        font-family: serif;
        font-size: 105px;
        line-height: 120px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      <h3
          class="emotion-0"
          data-level="3"
        >
          H3
        </h3>
      </DocumentFragment>
    `);
  });
});
