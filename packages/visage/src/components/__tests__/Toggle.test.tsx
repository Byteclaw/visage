/* eslint-disable no-irregular-whitespace */
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { render, createTestTheme } from './render';
import { Toggle } from '../Toggle';

describe('Toggle', () => {
  it('respects disabled prop', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Toggle
        data-testid="toggle"
        disabled
        onClick={handler}
        onKeyDown={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    expect(getByTestId('toggle')).toHaveAttribute('disabled');
    expect(getByTestId('label')).toHaveAttribute('disabled');

    fireEvent.click(getByTestId('toggle'));
    // we don't fire a keyDown because it isn't possible to focus disabled checkbox in browser

    expect(handler).not.toHaveBeenCalled();
  });

  it('respects hiddenLabel prop', () => {
    const { getByTestId } = render(
      <Toggle
        data-testid="toggle"
        hiddenLabel
        label="Label"
        labelProps={{ 'data-testid': 'label' }}
        labelTextProps={{ 'data-testid': 'label-text' }}
      />,
    );

    expect(getByTestId('label-text')).toHaveAttribute('data-hidden', 'true');
  });

  it('respects invalid prop', () => {
    const props = {
      'data-testid': 'toggle',
      label: 'Label',
      labelProps: { 'data-test-id': 'label' },
      labelTextProps: { 'date-testid': 'label-text' },
    };
    const { container, getByTestId, rerender } = render(<Toggle {...props} />);

    expect(getByTestId('toggle')).not.toHaveAttribute('aria-invalid');
    expect(container.querySelector('[data-invalid="false"]')).toBeDefined();

    rerender(<Toggle {...props} invalid />);

    expect(getByTestId('toggle')).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelector('[data-invalid="true"]')).toBeDefined();
  });

  it('respects readOnly prop', () => {
    const handler = jest.fn();
    const { getByTestId, container } = render(
      <Toggle
        data-testid="toggle"
        readOnly
        onClick={handler}
        onKeyDown={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    // read only checkbox can be focused, clicked, etc but can't be changed
    expect(getByTestId('toggle')).toHaveAttribute('readOnly');
    expect(container.querySelector('[data-checked="false"]')).toBeDefined();

    fireEvent.click(getByTestId('toggle'));
    fireEvent.keyDown(getByTestId('toggle'), { key: ' ' });

    expect(container.querySelector('[data-checked="false"]')).toBeDefined();

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('can be controlled', () => {
    const handler = jest.fn();
    const { getByTestId, container, rerender } = render(
      <Toggle
        checked={false}
        data-testid="toggle"
        onChange={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    expect(container.querySelector('[data-checked="false"]')).toBeDefined();

    fireEvent.click(getByTestId('toggle'));

    // does nothing
    expect(container.querySelector('[data-checked="false"]')).toBeDefined();

    rerender(
      <Toggle
        checked
        data-testid="toggle"
        onChange={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[data-checked="true"]')).toBeDefined();

    fireEvent.click(getByTestId('toggle'));

    // does nothing
    expect(container.querySelector('[data-checked="true"]')).toBeDefined();
  });

  it('can be uncontrolled', () => {
    const handler = jest.fn();
    const { getByTestId, container, rerender } = render(
      <Toggle
        data-testid="toggle"
        onChange={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    expect(container.querySelector('[data-checked="false"]')).toBeDefined();

    fireEvent.click(getByTestId('toggle'));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[data-checked="true"]')).toBeDefined();

    fireEvent.click(getByTestId('toggle'));

    expect(handler).toHaveBeenCalledTimes(2);
    expect(container.querySelector('[data-checked="false"]')).toBeDefined();

    rerender(
      <Toggle
        defaultChecked
        key="test"
        data-testid="toggle"
        onChange={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    expect(container.querySelector('[data-checked="true"]')).toBeDefined();

    fireEvent.click(getByTestId('toggle'));

    expect(handler).toHaveBeenCalledTimes(3);
    expect(container.querySelector('[data-checked="false"]')).toBeDefined();
  });

  it('renders correctly', () => {
    const { asFragment } = render(<Toggle label="Required label" />);

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

      .emotion-2 {
        overflow: hidden;
        border-radius: 999px;
        width: auto;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        height: 1.5em;
        min-width: 2.75em;
        font-size: 16px;
        border-width: 2px;
        border-style: solid;
        border-color: rgba(0,0,0,0);
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: rgb(184,184,184);
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::after {
        content: "";
        vertical-align: middle;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 1.25em;
        height: 1.25em;
        position: absolute;
        border-radius: 50%;
        background-color: rgb(255,255,255);
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.1s;
        transition-duration: 0.1s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::before {
        content: attr(data-label-content);
        position: absolute;
        margin-left: 8px;
        margin-right: 8px;
        font-size: 0.75em;
        text-align: center;
        color: rgb(255,255,255);
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        white-space: nowrap;
        left: 50%;
      }

      .emotion-2[data-checked="true"] {
        background-color: light-blue;
      }

      .emotion-2[data-checked="true"] > div {
        -webkit-transform: translateX(calc(100% - 1.25em - 0px));
        -ms-transform: translateX(calc(100% - 1.25em - 0px));
        transform: translateX(calc(100% - 1.25em - 0px));
      }

      .emotion-2[data-checked="true"] > div::before {
        left: -50%;
      }

      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-2[data-focused="true"][data-invalid="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(255,0,0);
      }

      .emotion-2[data-invalid="true"] {
        border-color: rgb(255,0,0);
      }

      .emotion-1 {
        font-size: inherit;
        display: inline-block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: relative;
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-3 {
        font-size: inherit;
        line-height: inherit;
        position: relative;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-left: 8px;
        margin-right: 8px;
      }

      .emotion-4 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }

      <label
          class="emotion-4"
          data-disabled="false"
        >
          <input
            class="emotion-0"
            type="checkbox"
            value=""
          />
          <div
            class="emotion-2"
            data-checked="false"
            data-focused="false"
            data-invalid="false"
          >
            <div
              class="emotion-1"
            />
          </div>
          <span
            class="emotion-3"
            data-hidden="false"
          >
            Required label
          </span>
        </label>
      </DocumentFragment>
    `);
  });

  it('is extendable by ToggleLabel face', () => {
    const { asFragment } = render(<Toggle label="test" />, {
      ds: {
        theme: createTestTheme({ ToggleLabel: { borderRadius: 10 } }),
      },
    });

    // emotion 4 should have border-radius: 10px;
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

      .emotion-2 {
        overflow: hidden;
        border-radius: 999px;
        width: auto;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        height: 1.5em;
        min-width: 2.75em;
        font-size: 16px;
        border-width: 2px;
        border-style: solid;
        border-color: rgba(0,0,0,0);
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: rgb(184,184,184);
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::after {
        content: "";
        vertical-align: middle;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 1.25em;
        height: 1.25em;
        position: absolute;
        border-radius: 50%;
        background-color: rgb(255,255,255);
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.1s;
        transition-duration: 0.1s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::before {
        content: attr(data-label-content);
        position: absolute;
        margin-left: 8px;
        margin-right: 8px;
        font-size: 0.75em;
        text-align: center;
        color: rgb(255,255,255);
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        white-space: nowrap;
        left: 50%;
      }

      .emotion-2[data-checked="true"] {
        background-color: light-blue;
      }

      .emotion-2[data-checked="true"] > div {
        -webkit-transform: translateX(calc(100% - 1.25em - 0px));
        -ms-transform: translateX(calc(100% - 1.25em - 0px));
        transform: translateX(calc(100% - 1.25em - 0px));
      }

      .emotion-2[data-checked="true"] > div::before {
        left: -50%;
      }

      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-2[data-focused="true"][data-invalid="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(255,0,0);
      }

      .emotion-2[data-invalid="true"] {
        border-color: rgb(255,0,0);
      }

      .emotion-1 {
        font-size: inherit;
        display: inline-block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: relative;
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-3 {
        font-size: inherit;
        line-height: inherit;
        position: relative;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-left: 8px;
        margin-right: 8px;
      }

      .emotion-4 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        border-radius: 10px;
      }

      <label
          class="emotion-4"
          data-disabled="false"
        >
          <input
            class="emotion-0"
            type="checkbox"
            value=""
          />
          <div
            class="emotion-2"
            data-checked="false"
            data-focused="false"
            data-invalid="false"
          >
            <div
              class="emotion-1"
            />
          </div>
          <span
            class="emotion-3"
            data-hidden="false"
          >
            test
          </span>
        </label>
      </DocumentFragment>
    `);
  });

  it('is extendable by ToggleContainer face', () => {
    const { asFragment } = render(<Toggle label="test" />, {
      ds: {
        theme: createTestTheme({ ToggleContainer: { borderRadius: 10 } }),
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

      .emotion-1 {
        font-size: inherit;
        display: inline-block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: relative;
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-3 {
        font-size: inherit;
        line-height: inherit;
        position: relative;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-left: 8px;
        margin-right: 8px;
      }

      .emotion-4 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }

      .emotion-2 {
        overflow: hidden;
        border-radius: 10px;
        width: auto;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        height: 1.5em;
        min-width: 2.75em;
        font-size: 16px;
        border-width: 2px;
        border-style: solid;
        border-color: rgba(0,0,0,0);
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: rgb(184,184,184);
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::after {
        content: "";
        vertical-align: middle;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 1.25em;
        height: 1.25em;
        position: absolute;
        border-radius: 50%;
        background-color: rgb(255,255,255);
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.1s;
        transition-duration: 0.1s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::before {
        content: attr(data-label-content);
        position: absolute;
        margin-left: 8px;
        margin-right: 8px;
        font-size: 0.75em;
        text-align: center;
        color: rgb(255,255,255);
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        white-space: nowrap;
        left: 50%;
      }

      .emotion-2[data-checked="true"] {
        background-color: light-blue;
      }

      .emotion-2[data-checked="true"] > div {
        -webkit-transform: translateX(calc(100% - 1.25em - 0px));
        -ms-transform: translateX(calc(100% - 1.25em - 0px));
        transform: translateX(calc(100% - 1.25em - 0px));
      }

      .emotion-2[data-checked="true"] > div::before {
        left: -50%;
      }

      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-2[data-focused="true"][data-invalid="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(255,0,0);
      }

      .emotion-2[data-invalid="true"] {
        border-color: rgb(255,0,0);
      }

      <label
          class="emotion-4"
          data-disabled="false"
        >
          <input
            class="emotion-0"
            type="checkbox"
            value=""
          />
          <div
            class="emotion-2"
            data-checked="false"
            data-focused="false"
            data-invalid="false"
          >
            <div
              class="emotion-1"
            />
          </div>
          <span
            class="emotion-3"
            data-hidden="false"
          >
            test
          </span>
        </label>
      </DocumentFragment>
    `);
  });

  it('is extendable by ToggleLabelText face', () => {
    const { asFragment } = render(<Toggle label="test" />, {
      ds: {
        theme: createTestTheme({ ToggleLabelText: { borderRadius: 10 } }),
      },
    });

    // emotion 3 should have border-radius: 10px;
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

      .emotion-2 {
        overflow: hidden;
        border-radius: 999px;
        width: auto;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        height: 1.5em;
        min-width: 2.75em;
        font-size: 16px;
        border-width: 2px;
        border-style: solid;
        border-color: rgba(0,0,0,0);
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: rgb(184,184,184);
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::after {
        content: "";
        vertical-align: middle;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 1.25em;
        height: 1.25em;
        position: absolute;
        border-radius: 50%;
        background-color: rgb(255,255,255);
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.1s;
        transition-duration: 0.1s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::before {
        content: attr(data-label-content);
        position: absolute;
        margin-left: 8px;
        margin-right: 8px;
        font-size: 0.75em;
        text-align: center;
        color: rgb(255,255,255);
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        white-space: nowrap;
        left: 50%;
      }

      .emotion-2[data-checked="true"] {
        background-color: light-blue;
      }

      .emotion-2[data-checked="true"] > div {
        -webkit-transform: translateX(calc(100% - 1.25em - 0px));
        -ms-transform: translateX(calc(100% - 1.25em - 0px));
        transform: translateX(calc(100% - 1.25em - 0px));
      }

      .emotion-2[data-checked="true"] > div::before {
        left: -50%;
      }

      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-2[data-focused="true"][data-invalid="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(255,0,0);
      }

      .emotion-2[data-invalid="true"] {
        border-color: rgb(255,0,0);
      }

      .emotion-1 {
        font-size: inherit;
        display: inline-block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: relative;
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-4 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }

      .emotion-3 {
        font-size: inherit;
        line-height: inherit;
        position: relative;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-left: 8px;
        margin-right: 8px;
        border-radius: 10px;
      }

      <label
          class="emotion-4"
          data-disabled="false"
        >
          <input
            class="emotion-0"
            type="checkbox"
            value=""
          />
          <div
            class="emotion-2"
            data-checked="false"
            data-focused="false"
            data-invalid="false"
          >
            <div
              class="emotion-1"
            />
          </div>
          <span
            class="emotion-3"
            data-hidden="false"
          >
            test
          </span>
        </label>
      </DocumentFragment>
    `);
  });

  it('is extendable by ToggleControl face', () => {
    const { asFragment } = render(<Toggle label="test" />, {
      ds: {
        theme: createTestTheme({ ToggleControl: { borderRadius: 10 } }),
      },
    });

    // emotion 0 should have border-radius: 10px;
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
        overflow: hidden;
        border-radius: 999px;
        width: auto;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        height: 1.5em;
        min-width: 2.75em;
        font-size: 16px;
        border-width: 2px;
        border-style: solid;
        border-color: rgba(0,0,0,0);
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: rgb(184,184,184);
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::after {
        content: "";
        vertical-align: middle;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 1.25em;
        height: 1.25em;
        position: absolute;
        border-radius: 50%;
        background-color: rgb(255,255,255);
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.1s;
        transition-duration: 0.1s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::before {
        content: attr(data-label-content);
        position: absolute;
        margin-left: 8px;
        margin-right: 8px;
        font-size: 0.75em;
        text-align: center;
        color: rgb(255,255,255);
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        white-space: nowrap;
        left: 50%;
      }

      .emotion-2[data-checked="true"] {
        background-color: light-blue;
      }

      .emotion-2[data-checked="true"] > div {
        -webkit-transform: translateX(calc(100% - 1.25em - 0px));
        -ms-transform: translateX(calc(100% - 1.25em - 0px));
        transform: translateX(calc(100% - 1.25em - 0px));
      }

      .emotion-2[data-checked="true"] > div::before {
        left: -50%;
      }

      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-2[data-focused="true"][data-invalid="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(255,0,0);
      }

      .emotion-2[data-invalid="true"] {
        border-color: rgb(255,0,0);
      }

      .emotion-1 {
        font-size: inherit;
        display: inline-block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: relative;
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-3 {
        font-size: inherit;
        line-height: inherit;
        position: relative;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-left: 8px;
        margin-right: 8px;
      }

      .emotion-4 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
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

      <label
          class="emotion-4"
          data-disabled="false"
        >
          <input
            class="emotion-0"
            type="checkbox"
            value=""
          />
          <div
            class="emotion-2"
            data-checked="false"
            data-focused="false"
            data-invalid="false"
          >
            <div
              class="emotion-1"
            />
          </div>
          <span
            class="emotion-3"
            data-hidden="false"
          >
            test
          </span>
        </label>
      </DocumentFragment>
    `);
  });

  it('is extendable by ToggleToggler face', () => {
    const { asFragment } = render(<Toggle label="test" />, {
      ds: {
        theme: createTestTheme({ ToggleToggler: { borderRadius: 10 } }),
      },
    });

    // emotion 1 should have border-radius: 10px;
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

      .emotion-2 {
        overflow: hidden;
        border-radius: 999px;
        width: auto;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        height: 1.5em;
        min-width: 2.75em;
        font-size: 16px;
        border-width: 2px;
        border-style: solid;
        border-color: rgba(0,0,0,0);
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: rgb(184,184,184);
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::after {
        content: "";
        vertical-align: middle;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 1.25em;
        height: 1.25em;
        position: absolute;
        border-radius: 50%;
        background-color: rgb(255,255,255);
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.1s;
        transition-duration: 0.1s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
      }

      .emotion-2 > div::before {
        content: attr(data-label-content);
        position: absolute;
        margin-left: 8px;
        margin-right: 8px;
        font-size: 0.75em;
        text-align: center;
        color: rgb(255,255,255);
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        white-space: nowrap;
        left: 50%;
      }

      .emotion-2[data-checked="true"] {
        background-color: light-blue;
      }

      .emotion-2[data-checked="true"] > div {
        -webkit-transform: translateX(calc(100% - 1.25em - 0px));
        -ms-transform: translateX(calc(100% - 1.25em - 0px));
        transform: translateX(calc(100% - 1.25em - 0px));
      }

      .emotion-2[data-checked="true"] > div::before {
        left: -50%;
      }

      .emotion-2[data-focused="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255);
      }

      .emotion-2[data-focused="true"][data-invalid="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(255,0,0);
      }

      .emotion-2[data-invalid="true"] {
        border-color: rgb(255,0,0);
      }

      .emotion-3 {
        font-size: inherit;
        line-height: inherit;
        position: relative;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-left: 8px;
        margin-right: 8px;
      }

      .emotion-4 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }

      .emotion-1 {
        font-size: inherit;
        display: inline-block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: relative;
        -webkit-transition-property: -webkit-transform,color;
        -webkit-transition-property: transform,color;
        transition-property: transform,color;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
        border-radius: 10px;
      }

      <label
          class="emotion-4"
          data-disabled="false"
        >
          <input
            class="emotion-0"
            type="checkbox"
            value=""
          />
          <div
            class="emotion-2"
            data-checked="false"
            data-focused="false"
            data-invalid="false"
          >
            <div
              class="emotion-1"
            />
          </div>
          <span
            class="emotion-3"
            data-hidden="false"
          >
            test
          </span>
        </label>
      </DocumentFragment>
    `);
  });
});
