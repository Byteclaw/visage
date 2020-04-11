import React from 'react';
import { render, createTestTheme } from './render';
import { TextInput } from '../TextInput';

describe('TextInput', () => {
  it('render correctly', () => {
    const { asFragment } = render(<TextInput />);

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
        .emotion-2 {
        background-color: rgb(255,255,255);
        border-color: rgb(0,0,0);
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding: 0px;
        position: relative;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .emotion-2:focus,
      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-1 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        width: 100%;
      }

      .emotion-0 {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: rgba(0,0,0,0);
        border: none;
        color: currentColor;
        cursor: inherit;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 8px;
        padding-right: 8px;
        width: 100%;
      }

      .emotion-0[data-prefix] {
        padding-left: 0px;
      }

      .emotion-0[data-suffix] {
        padding-right: 0px;
      }

      .emotion-0::-webkit-input-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0::-moz-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0:-ms-input-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0::placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      <div
          class="emotion-2"
          data-disabled="false"
          data-focused="false"
          data-invalid="false"
        >
          <div
            class="emotion-1"
          >
            <input
              class="emotion-0"
            />
          </div>
        </div>
      </DocumentFragment>
    `);
  });

  it('is extendable by TextInputBase face', () => {
    const { asFragment } = render(<TextInput />, {
      ds: {
        theme: createTestTheme({ TextInputBase: { borderRadius: 10 } }),
      },
    });

    // emotion 2 should have border-radius: 10px;
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
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        width: 100%;
      }

      .emotion-0 {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: rgba(0,0,0,0);
        border: none;
        color: currentColor;
        cursor: inherit;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 8px;
        padding-right: 8px;
        width: 100%;
      }

      .emotion-0[data-prefix] {
        padding-left: 0px;
      }

      .emotion-0[data-suffix] {
        padding-right: 0px;
      }

      .emotion-0::-webkit-input-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0::-moz-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0:-ms-input-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0::placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-2 {
        background-color: rgb(255,255,255);
        border-color: rgb(0,0,0);
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding: 0px;
        position: relative;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .emotion-2:focus,
      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      <div
          class="emotion-2"
          data-disabled="false"
          data-focused="false"
          data-invalid="false"
        >
          <div
            class="emotion-1"
          >
            <input
              class="emotion-0"
            />
          </div>
        </div>
      </DocumentFragment>
    `);
  });

  it('is extendable by TextInputControl face', () => {
    const { asFragment } = render(<TextInput />, {
      ds: {
        theme: createTestTheme({
          TextInputControl: {
            borderRadius: 10,
            '::placeholder': { opacity: 1, color: 'pink' },
          },
        }),
      },
    });

    // emotion-0 should have border-radius: 10px; and placeholder styles
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
        .emotion-2 {
        background-color: rgb(255,255,255);
        border-color: rgb(0,0,0);
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding: 0px;
        position: relative;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .emotion-2:focus,
      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-1 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        width: 100%;
      }

      .emotion-0 {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: rgba(0,0,0,0);
        border: none;
        color: currentColor;
        cursor: inherit;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 8px;
        padding-right: 8px;
        width: 100%;
        border-radius: 10px;
      }

      .emotion-0[data-prefix] {
        padding-left: 0px;
      }

      .emotion-0[data-suffix] {
        padding-right: 0px;
      }

      .emotion-0::-webkit-input-placeholder {
        color: rgb(255,192,203);
        opacity: 1;
      }

      .emotion-0::-moz-placeholder {
        color: rgb(255,192,203);
        opacity: 1;
      }

      .emotion-0:-ms-input-placeholder {
        color: rgb(255,192,203);
        opacity: 1;
      }

      .emotion-0::placeholder {
        color: rgb(255,192,203);
        opacity: 1;
      }

      <div
          class="emotion-2"
          data-disabled="false"
          data-focused="false"
          data-invalid="false"
        >
          <div
            class="emotion-1"
          >
            <input
              class="emotion-0"
            />
          </div>
        </div>
      </DocumentFragment>
    `);
  });

  it('is extendable by TextInputControlBase face', () => {
    const { asFragment } = render(<TextInput />, {
      ds: {
        theme: createTestTheme({
          TextInputControlBase: { borderRadius: 10 },
        }),
      },
    });

    // emotion-1 should have border-radius: 10px;
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
        .emotion-2 {
        background-color: rgb(255,255,255);
        border-color: rgb(0,0,0);
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding: 0px;
        position: relative;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .emotion-2:focus,
      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-0 {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: rgba(0,0,0,0);
        border: none;
        color: currentColor;
        cursor: inherit;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 8px;
        padding-right: 8px;
        width: 100%;
      }

      .emotion-0[data-prefix] {
        padding-left: 0px;
      }

      .emotion-0[data-suffix] {
        padding-right: 0px;
      }

      .emotion-0::-webkit-input-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0::-moz-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0:-ms-input-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0::placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-1 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        width: 100%;
        border-radius: 10px;
      }

      <div
          class="emotion-2"
          data-disabled="false"
          data-focused="false"
          data-invalid="false"
        >
          <div
            class="emotion-1"
          >
            <input
              class="emotion-0"
            />
          </div>
        </div>
      </DocumentFragment>
    `);
  });

  it('is extendable by InputExtraElement face', () => {
    const { asFragment } = render(<TextInput prefix={<span>P</span>} />, {
      ds: {
        theme: createTestTheme({
          InputExtraElement: { borderRadius: 10, '&:hover': { color: 'pink' } },
        }),
      },
    });

    // emotion-0 should have border-radius: 10px; and hover color pink
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
        .emotion-3 {
        background-color: rgb(255,255,255);
        border-color: rgb(0,0,0);
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding: 0px;
        position: relative;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .emotion-3:focus,
      .emotion-3[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-2 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        width: 100%;
      }

      .emotion-1 {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: rgba(0,0,0,0);
        border: none;
        color: currentColor;
        cursor: inherit;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -webkit-flex-shrink: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        -webkit-flex-basis: 0%;
        -ms-flex-preferred-size: 0%;
        flex-basis: 0%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 8px;
        padding-right: 8px;
        width: 100%;
      }

      .emotion-1[data-prefix] {
        padding-left: 0px;
      }

      .emotion-1[data-suffix] {
        padding-right: 0px;
      }

      .emotion-1::-webkit-input-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-1::-moz-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-1:-ms-input-placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-1::placeholder {
        color: currentColor;
        opacity: 0.3;
      }

      .emotion-0 {
        color: currentColor;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-basis: auto;
        -ms-flex-preferred-size: auto;
        flex-basis: auto;
        -webkit-box-flex: 0;
        -webkit-flex-grow: 0;
        -ms-flex-positive: 0;
        flex-grow: 0;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        font-size: inherit;
        line-height: inherit;
        max-width: 100%;
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 10px;
      }

      .emotion-0:hover {
        color: rgb(255,192,203);
      }

      <div
          class="emotion-3"
          data-disabled="false"
          data-focused="false"
          data-invalid="false"
        >
          <div
            class="emotion-0"
            data-prefix="true"
          >
            <span>
              P
            </span>
          </div>
          <div
            class="emotion-2"
          >
            <input
              class="emotion-1"
              data-prefix="true"
            />
          </div>
        </div>
      </DocumentFragment>
    `);
  });
});
