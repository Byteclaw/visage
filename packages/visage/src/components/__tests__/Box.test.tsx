import React from 'react';
import { render } from './render';
import { Box } from '../Box';

describe('Box', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<Box />);

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
        <div
          class="emotion-0"
        />
      </DocumentFragment>
    `);
  });
});
