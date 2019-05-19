import React from 'react';
import { render } from 'react-testing-library';
import { createComponent, createTheme, DesignSystem } from '..';

const Link = createComponent('a');

const theme = createTheme(
  {
    colors: {
      primary: {
        values: ['light-blue', 'blue', 'dark-blue'],
        offset: 0,
      },
      secondary: 'blue',
    },
    fontSizes: {
      values: [10],
      offset: 0,
    },
    lineHeights: {
      values: [20],
      offset: 0,
    },
    spacings: {
      values: [0, 2, 4, 8, 16, 32],
      offset: 0,
    },
  },
  {
    color: 'colors',
    backgroundColor: 'colors',
    fontSize: 'fontSizes',
    lineHeight: 'lineHeights',
    margin: 'spacings',
    padding: 'spacings',
  },
);

describe('DesignSystem', () => {
  it('works correctly', async () => {
    const { asFragment } = render(
      <DesignSystem theme={theme}>
        <Link href="a">Link without styles</Link>
        <Link href="a" styles={{ background: '#ccc', color: 'red' }}>
          Link with styles
        </Link>
        <Link
          href="a"
          activeStyles={{ color: 'blue' }}
          hoverStyles={{ color: 'pink' }}
          focusStyles={{ color: 'black' }}
          styles={{ background: '#ccc', color: 'white' }}
        >
          Link with extension styles
        </Link>
      </DesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
                                                <DocumentFragment>
                                                  <a
                                                    href="a"
                                                  >
                                                    Link without styles
                                                  </a>
                                                  .emotion-0 {
                                                  background: #ccc;
                                                  color: red;
                                                }

                                                <a
                                                    class="emotion-0"
                                                    href="a"
                                                  >
                                                    Link with styles
                                                  </a>
                                                  .emotion-0 {
                                                  background: #ccc;
                                                  color: white;
                                                }

                                                .emotion-0:active {
                                                  color: blue;
                                                }

                                                .emotion-0:focus {
                                                  color: black;
                                                }

                                                .emotion-0:hover {
                                                  color: pink;
                                                }

                                                <a
                                                    class="emotion-0"
                                                    href="a"
                                                  >
                                                    Link with extension styles
                                                  </a>
                                                </DocumentFragment>
                                `);
  });

  it('works with extending', () => {
    const A = createComponent('a', {
      defaultProps: {
        hoverStyles: { background: 'black' },
        styles: { color: 'red' },
      },
    });
    const B = createComponent('span', {
      defaultProps: {
        hoverStyles: { background: 'red', color: 'white' },
        styles: { background: 'black', color: 'blue' },
      },
    });
    const { asFragment } = render(
      <DesignSystem theme={theme}>
        <A href="/" />
        <B />
        <A as={B} href="/" />
        <B as={A} href="/" />
      </DesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
                              <DocumentFragment>
                                .emotion-0 {
                                color: red;
                              }

                              .emotion-0:hover {
                                background: black;
                              }

                              <a
                                  class="emotion-0"
                                  href="/"
                                />
                                .emotion-0 {
                                background: black;
                                color: blue;
                              }

                              .emotion-0:hover {
                                background: red;
                                color: white;
                              }

                              <span
                                  class="emotion-0"
                                />
                                .emotion-0 {
                                background: black;
                                color: red;
                              }

                              .emotion-0:hover {
                                background: black;
                                color: white;
                              }

                              <span
                                  class="emotion-0"
                                  href="/"
                                />
                                .emotion-0 {
                                color: blue;
                                background: black;
                              }

                              .emotion-0:hover {
                                background: red;
                                color: white;
                              }

                              <a
                                  class="emotion-0"
                                  href="/"
                                />
                              </DocumentFragment>
                    `);
  });

  it('works with theme', () => {
    const Box = createComponent('div', {
      defaultProps: {
        styles: {
          color: 'red',
          backgroundColor: 'secondary',
          fontSize: 0,
          lineHeight: 0,
        },
      },
    });
    const { asFragment } = render(
      <DesignSystem theme={theme}>
        <Box />
        <Box styles={{ color: 'primary' }} />
        <Box styles={{ color: 'primary.1', margin: 1, padding: 2 }} />
        <Box styles={{ color: 'primary.-1', margin: 2, padding: [3, 4] }} />
      </DesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        .emotion-0 {
        color: red;
        background-color: blue;
        font-size: 10px;
        line-height: 20;
      }

      <div
          class="emotion-0"
        />
        .emotion-0 {
        background-color: blue;
        font-size: 10px;
        line-height: 20;
      }

      <div
          class="emotion-0"
        />
        .emotion-0 {
        color: blue;
        background-color: blue;
        font-size: 10px;
        line-height: 20;
        margin: 2px;
        padding: 4px;
      }

      <div
          class="emotion-0"
        />
        .emotion-0 {
        color: light-blue;
        background-color: blue;
        font-size: 10px;
        line-height: 20;
        margin: 4px;
        padding: 8px;
      }

      <div
          class="emotion-0"
        />
      </DocumentFragment>
    `);
  });
});
