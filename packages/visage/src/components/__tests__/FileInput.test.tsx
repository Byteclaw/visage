import React from 'react';
import { render, createTestTheme } from './render';
import { FileInput } from '../FileInput';

describe('FileInput', () => {
  it('render correctly', () => {
    const { asFragment } = render(<FileInput />);

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
        border: none;
        font-size: 16px;
        line-height: 24px;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        position: relative;
        max-width: 100%;
      }

      .emotion-0 {
        border: 0;
        -webkit-clip: rect(0,0,0,0);
        clip: rect(0,0,0,0);
        height: 1px;
        overflow: hidden;
        margin: -1px;
        padding: 0px;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      .emotion-0:focus + div {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-0[aria-invalid="true"]:focus + div {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px red,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-1 {
        background-color: white;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        color: currentColor;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        overflow: hidden;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 16px;
        padding-right: 16px;
        text-overflow: ellipsis;
        width: 100%;
        white-space: nowrap;
      }

      .emotion-1::before {
        content: "\\200b";
      }

      .emotion-1[data-draggedover="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-1:not([data-readonly="true"]) {
        cursor: pointer;
      }

      <div
          class="emotion-2"
        >
          <input
            class="emotion-0"
            placeholder="Choose a file"
            type="file"
          />
          <div
            class="emotion-1"
            data-disabled="false"
            data-draggedover="false"
            data-invalid="false"
          >
            Choose a file
          </div>
        </div>
      </DocumentFragment>
    `);
  });

  it('is extendable by FileInputBase face', () => {
    const { asFragment } = render(<FileInput />, {
      ds: {
        theme: createTestTheme({ FileInputBase: { borderRadius: 10 } }),
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
        .emotion-0 {
        border: 0;
        -webkit-clip: rect(0,0,0,0);
        clip: rect(0,0,0,0);
        height: 1px;
        overflow: hidden;
        margin: -1px;
        padding: 0px;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      .emotion-0:focus + div {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-0[aria-invalid="true"]:focus + div {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px red,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-1 {
        background-color: white;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        color: currentColor;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        overflow: hidden;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 16px;
        padding-right: 16px;
        text-overflow: ellipsis;
        width: 100%;
        white-space: nowrap;
      }

      .emotion-1::before {
        content: "\\200b";
      }

      .emotion-1[data-draggedover="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-1:not([data-readonly="true"]) {
        cursor: pointer;
      }

      .emotion-2 {
        border: none;
        font-size: 16px;
        line-height: 24px;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        position: relative;
        max-width: 100%;
        border-radius: 10px;
      }

      <div
          class="emotion-2"
        >
          <input
            class="emotion-0"
            placeholder="Choose a file"
            type="file"
          />
          <div
            class="emotion-1"
            data-disabled="false"
            data-draggedover="false"
            data-invalid="false"
          >
            Choose a file
          </div>
        </div>
      </DocumentFragment>
    `);
  });

  it('is extendable by FileIputControl face', () => {
    const { asFragment } = render(<FileInput />, {
      ds: {
        theme: createTestTheme({
          FileInputControl: {
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
        border: none;
        font-size: 16px;
        line-height: 24px;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        position: relative;
        max-width: 100%;
      }

      .emotion-1 {
        background-color: white;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        color: currentColor;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        overflow: hidden;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 16px;
        padding-right: 16px;
        text-overflow: ellipsis;
        width: 100%;
        white-space: nowrap;
      }

      .emotion-1::before {
        content: "\\200b";
      }

      .emotion-1[data-draggedover="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-1:not([data-readonly="true"]) {
        cursor: pointer;
      }

      .emotion-0 {
        border: 0;
        -webkit-clip: rect(0,0,0,0);
        clip: rect(0,0,0,0);
        height: 1px;
        overflow: hidden;
        margin: -1px;
        padding: 0px;
        position: absolute;
        white-space: nowrap;
        width: 1px;
        border-radius: 10px;
      }

      .emotion-0:focus + div {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-0[aria-invalid="true"]:focus + div {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px red,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-0::-webkit-input-placeholder {
        opacity: 1;
        color: pink;
      }

      .emotion-0::-moz-placeholder {
        opacity: 1;
        color: pink;
      }

      .emotion-0:-ms-input-placeholder {
        opacity: 1;
        color: pink;
      }

      .emotion-0::placeholder {
        opacity: 1;
        color: pink;
      }

      <div
          class="emotion-2"
        >
          <input
            class="emotion-0"
            placeholder="Choose a file"
            type="file"
          />
          <div
            class="emotion-1"
            data-disabled="false"
            data-draggedover="false"
            data-invalid="false"
          >
            Choose a file
          </div>
        </div>
      </DocumentFragment>
    `);
  });

  it('is extendable by FileInputControlBase face', () => {
    const { asFragment } = render(<FileInput />, {
      ds: {
        theme: createTestTheme({
          FileInputControlBase: { borderRadius: 10 },
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
        border: none;
        font-size: 16px;
        line-height: 24px;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        position: relative;
        max-width: 100%;
      }

      .emotion-0 {
        border: 0;
        -webkit-clip: rect(0,0,0,0);
        clip: rect(0,0,0,0);
        height: 1px;
        overflow: hidden;
        margin: -1px;
        padding: 0px;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      .emotion-0:focus + div {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-0[aria-invalid="true"]:focus + div {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px red,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-1 {
        background-color: white;
        border-color: black;
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
        color: currentColor;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        overflow: hidden;
        outline: none;
        margin: 0px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 16px;
        padding-right: 16px;
        text-overflow: ellipsis;
        width: 100%;
        white-space: nowrap;
      }

      .emotion-1::before {
        content: "\\200b";
      }

      .emotion-1[data-draggedover="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-1:not([data-readonly="true"]) {
        cursor: pointer;
      }

      <div
          class="emotion-2"
        >
          <input
            class="emotion-0"
            placeholder="Choose a file"
            type="file"
          />
          <div
            class="emotion-1"
            data-disabled="false"
            data-draggedover="false"
            data-invalid="false"
          >
            Choose a file
          </div>
        </div>
      </DocumentFragment>
    `);
  });
});
