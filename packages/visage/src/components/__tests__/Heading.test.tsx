import { render } from '@testing-library/react';
import React from 'react';
import { Heading } from '../Heading';
import { TestDesignSystem } from './DesignSystem';

describe('Heading', () => {
  it('renders as h1 by default', () => {
    const { asFragment } = render(
      <TestDesignSystem>
        <Heading>H1</Heading>
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        .emotion-0 {
        font-family: heading-font;
        font-size: 105px;
        line-height: 120px;
        margin-top: 16px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      <h1
          class="emotion-0"
        >
          H1
        </h1>
      </DocumentFragment>
    `);
  });

  it('determines host component based on level', () => {
    const { asFragment } = render(
      <TestDesignSystem>
        <Heading level={3}>H3</Heading>
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        .emotion-0 {
        font-family: heading-font;
        font-size: 41px;
        line-height: 48px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: normal;
      }

      <h3
          class="emotion-0"
        >
          H3
        </h3>
      </DocumentFragment>
    `);
  });
});
