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
              width: 1em;
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
                  viewBox="0 0 100.353 100.353"
                >
                  <path
                    d="M99.574 97.399L52.061 49.884 99.345 2.6A1.456 1.456 0 0097.286.54L50.002 47.824 2.721.54A1.456 1.456 0 10.662 2.6l47.281 47.284L.428 97.399a1.456 1.456 0 102.06 2.06l47.515-47.515 47.513 47.515a1.453 1.453 0 002.06 0 1.458 1.458 0 00-.002-2.06z"
                    fill="#231f20"
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
              width: 1em;
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
                  viewBox="0 0 100.353 100.353"
                >
                  <path
                    d="M99.574 97.399L52.061 49.884 99.345 2.6A1.456 1.456 0 0097.286.54L50.002 47.824 2.721.54A1.456 1.456 0 10.662 2.6l47.281 47.284L.428 97.399a1.456 1.456 0 102.06 2.06l47.515-47.515 47.513 47.515a1.453 1.453 0 002.06 0 1.458 1.458 0 00-.002-2.06z"
                    fill="#231f20"
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
        width: 1em;
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
            viewBox="0 0 100.353 100.353"
          >
            <path
              d="M99.574 97.399L52.061 49.884 99.345 2.6A1.456 1.456 0 0097.286.54L50.002 47.824 2.721.54A1.456 1.456 0 10.662 2.6l47.281 47.284L.428 97.399a1.456 1.456 0 102.06 2.06l47.515-47.515 47.513 47.515a1.453 1.453 0 002.06 0 1.458 1.458 0 00-.002-2.06z"
              fill="#231f20"
            />
          </svg>
        </div>
      </DocumentFragment>
    `);
  });
});
