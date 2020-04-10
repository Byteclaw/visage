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
        .emotion-0 {
        border: 1px;
        border-color: light-blue;
        border-style: solid;
        border-radius: 4px;
        display: -webkit-inline-box;
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
        padding: 8px;
        position: relative;
        outline: none;
      }

      .emotion-0[data-clickable="true"] {
        cursor: pointer;
      }

      .emotion-0:focus,
      .emotion-0[aria-selected="true"] {
        box-shadow: 0 0 0 4px rgba(255,255,255,0.4),0 0 0 4px blue,inset 0 0 200px rgba(68,68,68,0.1);
      }

      <div
          class="emotion-0"
          data-clickable="false"
        >
          Non interactive Chip
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
    expect(document.querySelector('[data-testid="chip"] div')).not.toBeNull();

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
    expect(document.querySelector('[data-testid="chip"] div')).toBeNull();

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
    expect(document.querySelector('[data-testid="chip"] div')).not.toBeNull();

    fireEvent.click(document.querySelector('[data-testid="chip"] > button'));

    expect(onDelete).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId('chip'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
