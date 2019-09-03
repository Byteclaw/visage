import React from 'react';
import { render } from '@testing-library/react';
import { createComponent, createNPointTheme, DesignSystem } from '..';

const Link = createComponent('a');

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
          styles={{
            background: '#ccc',
            color: 'white',
            '&:active': { color: 'blue' },
            '&:hover': { color: 'pink' },
            '&:focus': { color: 'black' },
          }}
        >
          Link with extension styles
        </Link>
      </DesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <a
          class="emotion-0"
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

      .emotion-0:hover {
        color: pink;
      }

      .emotion-0:focus {
        color: black;
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
      defaultStyles: {
        color: 'red',
        '&:hover': { background: 'black' },
      },
    });
    const B = createComponent('span', {
      defaultStyles: {
        background: 'black',
        color: 'blue',
        '&:hover': { background: 'red', color: 'white' },
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
      defaultStyles: {
        color: 'red',
        backgroundColor: 'secondary',
        fontSize: 0,
        lineHeight: 0,
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
                    font-size: 16px;
                    line-height: 24px;
                  }

                  <div
                      class="emotion-0"
                    />
                    .emotion-0 {
                    color: light-blue;
                    background-color: blue;
                    font-size: 16px;
                    line-height: 24px;
                  }

                  <div
                      class="emotion-0"
                    />
                    .emotion-0 {
                    color: blue;
                    background-color: blue;
                    font-size: 16px;
                    line-height: 24px;
                    margin: 8px;
                    padding: 16px;
                  }

                  <div
                      class="emotion-0"
                    />
                    .emotion-0 {
                    color: light-blue;
                    background-color: blue;
                    font-size: 16px;
                    line-height: 24px;
                    margin: 16px;
                    padding: 24px;
                  }

                  <div
                      class="emotion-0"
                    />
                  </DocumentFragment>
            `);
  });
});
