import { render } from '@testing-library/react';
import React from 'react';
import { CloseIcon } from '../../assets/CloseIcon';
import { SvgIcon } from '../SvgIcon';
import { TestDesignSystem } from './DesignSystem';

describe('SvgIcon', () => {
  it('works correctly with host component', () => {
    const { asFragment } = render(
      <TestDesignSystem>
        <SvgIcon icon={CloseIcon} />
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
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
      }

      .emotion-0[data-variant="stroked"] path:last-child {
        fill: transparent;
        stroke: black;
      }

      .emotion-0[data-variant="default"] path:last-child {
        fill: black;
        stroke: transparent;
      }

      <div
          class="emotion-0"
          data-variant="default"
        >
          <svg
            viewBox="0 0 60.963 60.842"
          >
            <path
              d="M59.595 52.861L37.094 30.359 59.473 7.98a4.676 4.676 0 00-6.611-6.611L30.483 23.748 8.105 1.369A4.676 4.676 0 001.494 7.98l22.378 22.379L1.369 52.861a4.674 4.674 0 003.306 7.98 4.66 4.66 0 003.306-1.369L30.483 36.97l22.501 22.502c.913.913 2.109 1.369 3.306 1.369s2.393-.456 3.306-1.369a4.677 4.677 0 00-.001-6.611z"
            />
          </svg>
        </div>
      </DocumentFragment>
    `);
  });

  it('works correctly with element', () => {
    const { asFragment } = render(
      <TestDesignSystem>
        <SvgIcon icon={<CloseIcon />} />
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
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
      }

      .emotion-0[data-variant="stroked"] path:last-child {
        fill: transparent;
        stroke: black;
      }

      .emotion-0[data-variant="default"] path:last-child {
        fill: black;
        stroke: transparent;
      }

      <div
          class="emotion-0"
          data-variant="default"
        >
          <svg
            viewBox="0 0 60.963 60.842"
          >
            <path
              d="M59.595 52.861L37.094 30.359 59.473 7.98a4.676 4.676 0 00-6.611-6.611L30.483 23.748 8.105 1.369A4.676 4.676 0 001.494 7.98l22.378 22.379L1.369 52.861a4.674 4.674 0 003.306 7.98 4.66 4.66 0 003.306-1.369L30.483 36.97l22.501 22.502c.913.913 2.109 1.369 3.306 1.369s2.393-.456 3.306-1.369a4.677 4.677 0 00-.001-6.611z"
            />
          </svg>
        </div>
      </DocumentFragment>
    `);
  });

  it('works correctly with custom styles', () => {
    const { asFragment } = render(
      <TestDesignSystem>
        <SvgIcon icon={<CloseIcon />} styles={{ iconSize: 2 }} />
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
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
      }

      .emotion-0[data-variant="stroked"] {
        font-size: 48px;
        line-height: 48px;
      }

      .emotion-0[data-variant="stroked"] path:last-child {
        fill: transparent;
        stroke: black;
      }

      .emotion-0[data-variant="default"] {
        font-size: 48px;
        line-height: 48px;
      }

      .emotion-0[data-variant="default"] path:last-child {
        fill: black;
        stroke: transparent;
      }

      <div
          class="emotion-0"
          data-variant="default"
        >
          <svg
            viewBox="0 0 60.963 60.842"
          >
            <path
              d="M59.595 52.861L37.094 30.359 59.473 7.98a4.676 4.676 0 00-6.611-6.611L30.483 23.748 8.105 1.369A4.676 4.676 0 001.494 7.98l22.378 22.379L1.369 52.861a4.674 4.674 0 003.306 7.98 4.66 4.66 0 003.306-1.369L30.483 36.97l22.501 22.502c.913.913 2.109 1.369 3.306 1.369s2.393-.456 3.306-1.369a4.677 4.677 0 00-.001-6.611z"
            />
          </svg>
        </div>
      </DocumentFragment>
    `);
  });
});
