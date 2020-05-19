import React from 'react';
import { render } from '@testing-library/react';
import { createComponent, DesignSystem } from '..';
import { theme } from './TestDesignSystem';

const Link = createComponent('a');

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
        <a
          class="emotion-0"
          href="a"
        >
          Link without styles
        </a>
        .emotion-0 {
        background: #ccc;
        color: rgb(255,0,0);
      }

      <a
          class="emotion-0"
          href="a"
        >
          Link with styles
        </a>
        .emotion-0 {
        background: #ccc;
        color: rgb(255,255,255);
      }

      .emotion-0:active {
        color: rgb(0,0,255);
      }

      .emotion-0:hover {
        color: rgb(255,192,203);
      }

      .emotion-0:focus {
        color: rgb(0,0,0);
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
        color: rgb(255,0,0);
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
        color: rgb(0,0,255);
      }

      .emotion-0:hover {
        background: red;
        color: rgb(255,255,255);
      }

      <span
          class="emotion-0"
        />
        .emotion-0 {
        background: black;
        color: rgb(255,0,0);
      }

      .emotion-0:hover {
        background: black;
        color: rgb(255,255,255);
      }

      <span
          class="emotion-0"
          href="/"
        />
        .emotion-0 {
        color: rgb(0,0,255);
        background: black;
      }

      .emotion-0:hover {
        background: red;
        color: rgb(255,255,255);
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
        color: rgb(255,0,0);
        background-color: rgb(0,0,255);
        font-size: 16px;
        line-height: 24px;
      }

      <div
          class="emotion-0"
        />
        .emotion-0 {
        color: rgb(173,216,230);
        background-color: rgb(0,0,255);
        font-size: 16px;
        line-height: 24px;
      }

      <div
          class="emotion-0"
        />
        .emotion-0 {
        color: rgb(0,0,255);
        background-color: rgb(0,0,255);
        font-size: 16px;
        line-height: 24px;
        margin: 8px;
        padding: 16px;
      }

      <div
          class="emotion-0"
        />
        .emotion-0 {
        color: rgb(173,216,230);
        background-color: rgb(0,0,255);
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
