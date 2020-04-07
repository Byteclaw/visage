import React from 'react';
import { render } from './render';
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
        background-color: textInput;
        border-color: textInputBorder;
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
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px accent;
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
        background-color: transparent;
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
});
