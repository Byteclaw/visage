import { render } from '@testing-library/react';
import React from 'react';
import { TestDesignSystem } from './TestDesignSystem';
import { createResponsiveEmotionStyleGenerator } from '../emotionResponsiveStyleGenerator';
import { createComponent } from '../core';

const MOBILE_BP = `only screen`; // 40em
const TABLET_BP = `screen and (min-width: ${641 / 16}em)`; // 40.0625em
const DESKTOP_BP = `screen and (min-width: ${1025 / 16}em)`; // 64.036em

const defaultBreakpoints = [MOBILE_BP, TABLET_BP, DESKTOP_BP];

const styleGenerator =
  createResponsiveEmotionStyleGenerator(defaultBreakpoints);

describe('emotion responsive style generator', () => {
  it('works correctly', () => {
    const Box = createComponent('div', {
      styles: {
        color: 'primary',
        fontFamily: 'body',
        fontSize: [1, 2, 3],
        margin: [2, 3, 4],
        '@media only screen': {
          color: 'blue',
          fontSize: 1,
        },
      },
    });

    const { asFragment, rerender } = render(
      <TestDesignSystem is={0} styleGenerator={styleGenerator}>
        <Box />{' '}
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchSnapshot();

    rerender(
      <TestDesignSystem is={1} styleGenerator={styleGenerator}>
        <Box />{' '}
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchSnapshot();

    rerender(
      <TestDesignSystem is={2} styleGenerator={styleGenerator}>
        <Box />{' '}
      </TestDesignSystem>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
