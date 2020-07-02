import React from 'react';
import { CloseIcon } from '../../assets/CloseIcon';
import { SvgIcon } from '../SvgIcon';
import { render } from './render';

describe('SvgIcon', () => {
  it('works correctly with host component', () => {
    const { asFragment } = render(<SvgIcon icon={CloseIcon} />);

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

      <span
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
      </DocumentFragment>
    `);
  });

  it('works correctly with element', () => {
    const { asFragment } = render(<SvgIcon icon={<CloseIcon />} />);

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

      <span
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
      </DocumentFragment>
    `);
  });

  it('works correctly with custom styles', () => {
    const { asFragment } = render(
      <SvgIcon icon={<CloseIcon />} styles={{ iconSize: 2 }} />,
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
        .emotion-0 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        font-size: 48px;
        line-height: 48px;
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

      <span
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
      </DocumentFragment>
    `);
  });
});
