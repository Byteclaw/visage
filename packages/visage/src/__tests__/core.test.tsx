import React from 'react';
import { render } from '@testing-library/react';
import { createComponent } from '../core';
import { createNPointTheme } from '../createNPointTheme';
import { DesignSystem } from '../DesignSystem';

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
  describe('extending', () => {
    it('extends visage component correctly', () => {
      const A = createComponent('span', {
        defaultStyles: {
          color: 'black',
          margin: 1,
        },
      });
      const B = createComponent(A, {
        defaultStyles: {
          color: 'pink',
          padding: 1,
          '&[role="listbox-option"]:hover, &[role="listbox-option"]:focus': {
            color: 'blue',
          },
        },
      });

      const { asFragment } = render(
        <DesignSystem theme={theme}>
          <B />
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
          color: pink;
          margin: 8px;
          padding: 8px;
        }

        .emotion-0[role="listbox-option"]:hover,
        .emotion-0[role="listbox-option"]:focus {
          color: blue;
        }

        <span
            class="emotion-0"
          />
        </DocumentFragment>
      `);
    });
  });
});
