import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Chip } from '../Chip';
import { render } from './render';

describe('Chip', () => {
  it('is non interactive if no handler is passed', () => {
    const { asFragment } = render(<Chip>Non interactive Chip</Chip>);

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
        border-radius: 16px;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        font-family: serif;
        font-size: 10px;
        line-height: 24px;
        position: relative;
        outline: none;
        -webkit-transition: all 150ms;
        transition: all 150ms;
      }

      .emotion-1[data-clickable="true"] {
        cursor: pointer;
      }

      .emotion-1:focus,
      .emotion-1[aria-selected="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px rgb(0,0,255),inset 0 0 200px rgba(68,68,68,0.1);
      }

      .emotion-1[data-outlined="true"] {
        background-color: rgba(0,0,0,0);
        border-color: rgb(0,0,255);
        border-width: 1px;
      }

      .emotion-1[data-outlined="true"][data-variant="success"] {
        border-color: rgb(0,128,0);
        color: rgb(0,128,0);
      }

      .emotion-1[data-outlined="true"][data-variant="danger"] {
        border-color: rgb(255,0,0);
        color: rgb(255,0,0);
      }

      .emotion-1[data-outlined="true"][data-variant="info"] {
        border-color: rgb(0,255,255);
        color: rgb(0,255,255);
      }

      .emotion-1[data-outlined="true"][data-variant="warning"] {
        border-color: rgb(255,165,0);
        color: rgb(255,165,0);
      }

      .emotion-1[data-outlined="true"][data-variant="primary"] {
        border-color: rgb(173,216,230);
        color: rgb(173,216,230);
      }

      .emotion-1[data-outlined="true"][data-variant="default"] {
        border-style: solid;
        color: rgb(255,255,255);
      }

      .emotion-1[data-outlined="false"][data-variant="danger"] {
        background-color: rgb(255,0,0);
        color: rgb(255,255,255);
      }

      .emotion-1[data-outlined="false"][data-variant="info"] {
        background-color: rgb(0,255,255);
        color: rgb(255,255,255);
      }

      .emotion-1[data-outlined="false"][data-variant="primary"] {
        background-color: rgb(173,216,230);
        color: rgb(255,255,255);
      }

      .emotion-1[data-outlined="false"][data-variant="success"] {
        background-color: rgb(0,128,0);
        color: rgb(255,255,255);
      }

      .emotion-1[data-outlined="false"][data-variant="warning"] {
        background-color: rgb(255,165,0);
        color: rgb(255,255,255);
      }

      .emotion-1[data-outlined="false"][data-variant="default"] {
        background-color: rgb(238,238,238);
        color: rgb(0,0,0);
      }

      .emotion-0 {
        -webkit-align-self: center;
        -ms-flex-item-align: center;
        align-self: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 12px;
        padding-right: 12px;
        padding-top: 4px;
        padding-bottom: 4px;
        line-height: 1.2rem;
      }

      .emotion-0[data-size="true"] {
        padding-left: 8px;
        padding-right: 8px;
      }

      <div
          class="emotion-1"
          data-clickable="false"
          data-outlined="false"
          data-variant="default"
        >
          <span
            class="emotion-0"
            data-small="false"
          >
            Non interactive Chip
          </span>
        </div>
      </DocumentFragment>
    `);
  });

  it('is deletable if onDelete handler is passed', () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <Chip data-testid="chip" onDelete={onDelete}>
        Deletable chip
      </Chip>,
    );

    expect(getByTestId('chip').getAttribute('data-clickable')).toBe('false');
    expect(
      document.querySelector('[data-testid="chip"] > button'),
    ).not.toBeNull();

    fireEvent.click(document.querySelector('[data-testid="chip"] > button'));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('is interactive if onClick handler is passed', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <Chip data-testid="chip" onClick={onClick}>
        Clickable chip
      </Chip>,
    );

    expect(getByTestId('chip').getAttribute('data-clickable')).toBe('true');

    // deleter is not rendered
    expect(document.querySelector('[data-testid="chip"] > button')).toBeNull();

    fireEvent.click(getByTestId('chip'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is does not propagate click if deleter is clicked', () => {
    const onClick = jest.fn();
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <Chip data-testid="chip" onClick={onClick} onDelete={onDelete}>
        Clickable and deletable chip
      </Chip>,
    );

    expect(getByTestId('chip').getAttribute('data-clickable')).toBe('true');
    expect(
      document.querySelector('[data-testid="chip"] > button'),
    ).not.toBeNull();

    fireEvent.click(document.querySelector('[data-testid="chip"] > button'));

    expect(onDelete).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId('chip'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
