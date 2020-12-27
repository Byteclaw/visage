import React from 'react';
import { render } from './render';
import { CloseButton } from '../CloseButton';
import { createComponent } from '../../core';

describe('CloseButton', () => {
  it('renders correctly', () => {
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
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: none;
        border-radius: 4px;
        background-color: rgba(0,0,0,0);
        color: currentColor;
        cursor: pointer;
        font-size: 16px;
        line-height: 1rem;
        outline: none;
        margin: 0px;
        padding: 8px;
      }

      .emotion-1:focus {
        background-color: rgba(0,0,255,0.8);
        color: rgb(255,255,255);
      }

      .emotion-1:hover {
        background-color: rgba(0,0,255,0.8);
        color: rgb(255,255,255);
      }

      .emotion-1:active {
        background-color: rgba(0,0,255,0.8);
        color: rgb(255,255,255);
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
        width: auto;
      }

      @media all and (-ms-high-contrast:none),(-ms-high-contrast:active) {
        .emotion-0 svg {
          width: 1em;
        }
      }

      <button
          class="emotion-1"
          type="button"
        >
          <span
            aria-hidden="true"
            class="emotion-0"
          >
            <svg
              focusable="false"
              viewBox="0 0 24 24"
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
          </span>
        </button>
      </DocumentFragment>
    `);
  });

  it('can be extended properly', () => {
    const ExtendedCloseButton = createComponent(CloseButton, {
      defaultStyles: {
        mb: 1,
        ml: 'auto',
      },
    });

    const { asFragment } = render(<ExtendedCloseButton />);

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
        width: auto;
      }

      @media all and (-ms-high-contrast:none),(-ms-high-contrast:active) {
        .emotion-0 svg {
          width: 1em;
        }
      }

      .emotion-1 {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: none;
        border-radius: 4px;
        background-color: rgba(0,0,0,0);
        color: currentColor;
        cursor: pointer;
        font-size: 16px;
        line-height: 1rem;
        outline: none;
        margin: 0px;
        padding: 8px;
        margin-bottom: 8px;
        margin-left: auto;
      }

      .emotion-1:focus {
        background-color: rgba(0,0,255,0.8);
        color: rgb(255,255,255);
      }

      .emotion-1:hover {
        background-color: rgba(0,0,255,0.8);
        color: rgb(255,255,255);
      }

      .emotion-1:active {
        background-color: rgba(0,0,255,0.8);
        color: rgb(255,255,255);
      }

      <button
          class="emotion-1"
          type="button"
        >
          <span
            aria-hidden="true"
            class="emotion-0"
          >
            <svg
              focusable="false"
              viewBox="0 0 24 24"
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
          </span>
        </button>
      </DocumentFragment>
    `);
  });
});
