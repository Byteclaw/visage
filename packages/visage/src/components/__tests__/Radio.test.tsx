/* eslint-disable no-irregular-whitespace */
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { render } from './render';
import { Radio } from '../Radio';

describe('Radio', () => {
  it('respects disabled prop', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Radio
        data-testid="radio"
        disabled
        onClick={handler}
        onKeyDown={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    expect(getByTestId('radio')).toHaveAttribute('disabled');
    expect(getByTestId('label')).toHaveAttribute('disabled');

    fireEvent.click(getByTestId('radio'));
    // we don't fire a keyDown because it isn't possible to focus disabled checkbox in browser

    expect(handler).not.toHaveBeenCalled();
  });

  it('respects hiddenLabel prop', () => {
    const { getByTestId } = render(
      <Radio
        data-testid="radio"
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
      'data-testid': 'radio',
      label: 'Label',
      labelProps: { 'data-test-id': 'label' },
      labelTextProps: { 'date-testid': 'label-text' },
    };
    const { getByTestId, rerender } = render(<Radio {...props} />);

    expect(getByTestId('radio')).not.toHaveAttribute('aria-invalid');

    rerender(<Radio {...props} invalid />);

    expect(getByTestId('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('respects readOnly prop', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Radio
        data-testid="radio"
        readOnly
        onClick={handler}
        onKeyDown={handler}
        label=""
        labelProps={{ 'data-testid': 'label' }}
      />,
    );

    // read only checkbox can be focused, clicked, etc but can't be changed
    expect(getByTestId('radio')).toHaveAttribute('readOnly');

    fireEvent.click(getByTestId('radio'));
    fireEvent.keyDown(getByTestId('radio'), { key: ' ' });

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('renders correctly', () => {
    const { asFragment } = render(<Radio label="Required label" />);

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
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px lightAccent;
      }

      .emotion-0 + div {
        background-color: textInput;
      }

      .emotion-0:checked + div {
        background-color: light-blue;
        border-color: light-blue;
        color: white;
      }

      .emotion-0[aria-invalid="true"] + div {
        border-color: danger;
      }

      .emotion-0 + div > svg {
        visibility: hidden;
      }

      .emotion-0:checked + div > svg {
        visibility: visible;
        fill: textInput;
      }

      .emotion-2 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        background: rgba(255,255,255,0.3);
        -webkit-align-self: center;
        -ms-flex-item-align: center;
        align-self: center;
        -webkit-transition: all 150ms;
        transition: all 150ms;
        border-radius: 999px;
        border-style: solid;
        border-width: 2px;
        border-color: lightAccent;
        margin-right: 8px;
      }

      .emotion-1 {
        width: 1em;
        height: 1em;
      }

      .emotion-3 {
        font-size: inherit;
        line-height: inherit;
      }

      .emotion-4 {
        -webkit-align-items: flex-start;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        align-items: flex-start;
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        font-size: inherit;
        line-height: inherit;
        margin: 0px;
        outline: none;
        padding: 0px;
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      <label
          class="emotion-4"
          data-disabled="false"
        >
          <input
            class="emotion-0"
            type="radio"
          />
          <div
            aria-hidden="true"
            class="emotion-2"
          >
            <svg
              class="emotion-1"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="6"
              />
            </svg>
          </div>
          ​ 
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
});
