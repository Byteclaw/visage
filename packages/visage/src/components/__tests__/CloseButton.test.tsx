import React from 'react';
import { render } from './render';
import { CloseButton } from '../CloseButton';

describe('CloseButton', () => {
  it('render correctly', () => {
    const { asFragment } = render(<CloseButton />);

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
        .emotion-1 {
        border-style: none;
        border-width: 0;
        border-radius: 4px;
        background-color: transparent;
        color: currentColor;
        cursor: pointer;
        font-size: 16px;
        line-height: 1em;
        outline: none;
        margin-top: 0px;
        margin-bottom: 0px;
        margin-left: 0px;
        padding: 8px;
      }

      .emotion-1:focus {
        background-color: lightAccent;
        color: lightAccentText;
      }

      .emotion-1:hover {
        background-color: lightAccent;
        color: lightAccentText;
      }

      .emotion-1:active {
        background-color: lightAccent;
        color: lightAccentText;
      }

      .emotion-0 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        font-size: inherit;
        line-height: inherit;
        width: 1em;
        height: 1em;
      }

      .emotion-0::before {
        content: "\\200b";
      }

      .emotion-0 svg {
        height: 1em;
        vertical-align: middle;
      }

      <button
          class="emotion-1"
          type="button"
        >
          <div
            aria-hidden="true"
            class="emotion-0"
          >
            <svg
              height="1em"
              viewBox="0 0 24 24"
              width="1em"
            >
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
              />
              <path
                d="M0 0h24v24H0z"
                fill="none"
              />
            </svg>
          </div>
        </button>
      </DocumentFragment>
    `);
  });
});
