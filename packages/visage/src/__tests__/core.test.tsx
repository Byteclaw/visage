import React from 'react';
import { render } from '@testing-library/react';
import { createComponent, createVariant, createBooleanVariant } from '../core';
import { createNPointTheme } from '../createNPointTheme';
import { DesignSystem } from '../DesignSystem';

const Span = createComponent('span', {
  displayName: 'Span',
  defaultStyles: {
    color: 'blue',
  },
});

const theme = createNPointTheme({
  baseFontSize: 16,
  baseLineHeightRatio: 1.6,
  baselineGridSize: 8,
  fontScaleRatio: 1.6,
  fontFamilies: {
    body: 'body-font',
    heading: 'heading-font',
  },
  colors: {
    primaryText: 'white',
    bodyText: 'black',
    primary: {
      values: ['light-blue', 'blue', 'dark-blue'],
      offset: 0,
    },
    secondary: 'blue',
  },
});

describe('core', () => {
  describe('createVariant', () => {
    it('works correctly', () => {
      const VariantedSpan = createVariant(Span, 'variant', {
        bold: {
          fontWeight: 'bold',
        },
      });

      const { asFragment } = render(
        <DesignSystem theme={theme}>
          <VariantedSpan />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                                                                <DocumentFragment>
                                                                  .emotion-0 {
                                                                  color: blue;
                                                                }

                                                                .emotion-0[data-variant="bold"] {
                                                                  font-weight: bold;
                                                                }

                                                                <span
                                                                    class="emotion-0"
                                                                    data-variant="default"
                                                                  />
                                                                </DocumentFragment>
                                                `);
    });

    it('works correctly with override', () => {
      const VariantedSpan = createVariant(Span, 'variant', {
        bold: {
          fontWeight: 'bold',
        },
      });

      const { asFragment } = render(
        <DesignSystem theme={theme}>
          <VariantedSpan as="p" />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                                                        <DocumentFragment>
                                                          .emotion-0 {
                                                          color: blue;
                                                        }

                                                        .emotion-0[data-variant="bold"] {
                                                          font-weight: bold;
                                                        }

                                                        <p
                                                            class="emotion-0"
                                                            data-variant="default"
                                                          />
                                                        </DocumentFragment>
                                          `);
    });
  });

  describe('createBooleanVariant', () => {
    it('works correctly (strips prop by default)', () => {
      const VariantedSpan = createBooleanVariant('disabled', {
        onStyles: {
          color: 'grey',
        },
      })(Span);

      const { asFragment, rerender } = render(
        <DesignSystem theme={theme}>
          <VariantedSpan />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                        <DocumentFragment>
                          .emotion-0 {
                          color: blue;
                        }

                        .emotion-0[data-disabled="true"] {
                          color: grey;
                        }

                        <span
                            class="emotion-0"
                            data-disabled="false"
                          />
                        </DocumentFragment>
                  `);

      rerender(
        <DesignSystem theme={theme}>
          <VariantedSpan disabled />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                        <DocumentFragment>
                          .emotion-0 {
                          color: blue;
                        }

                        .emotion-0[data-disabled="true"] {
                          color: grey;
                        }

                        <span
                            class="emotion-0"
                            data-disabled="true"
                          />
                        </DocumentFragment>
                  `);

      rerender(
        <DesignSystem theme={theme}>
          <VariantedSpan as="p" disabled />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          .emotion-0 {
          color: blue;
        }

        .emotion-0[data-disabled="true"] {
          color: grey;
        }

        <p
            class="emotion-0"
            data-disabled="true"
          />
        </DocumentFragment>
      `);
    });

    it('works correctly (does not strip prop if stripProp is false)', () => {
      const VariantedSpan = createBooleanVariant('disabled', {
        onStyles: {
          color: 'grey',
        },
        stripProp: false,
      })(Span);

      const { asFragment, rerender } = render(
        <DesignSystem theme={theme}>
          <VariantedSpan />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                        <DocumentFragment>
                          .emotion-0 {
                          color: blue;
                        }

                        .emotion-0[data-disabled="true"] {
                          color: grey;
                        }

                        <span
                            class="emotion-0"
                            data-disabled="false"
                          />
                        </DocumentFragment>
                  `);

      rerender(
        <DesignSystem theme={theme}>
          <VariantedSpan disabled />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
                        <DocumentFragment>
                          .emotion-0 {
                          color: blue;
                        }

                        .emotion-0[data-disabled="true"] {
                          color: grey;
                        }

                        <span
                            class="emotion-0"
                            data-disabled="true"
                            disabled=""
                          />
                        </DocumentFragment>
                  `);

      rerender(
        <DesignSystem theme={theme}>
          <VariantedSpan as="p" disabled />
        </DesignSystem>,
      );

      expect(asFragment()).toMatchInlineSnapshot(`
        <DocumentFragment>
          .emotion-0 {
          color: blue;
        }

        .emotion-0[data-disabled="true"] {
          color: grey;
        }

        <p
            class="emotion-0"
            data-disabled="true"
            disabled=""
          />
        </DocumentFragment>
      `);
    });
  });
});
