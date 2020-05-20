import { render } from '@testing-library/react';
import React from 'react';
import { createComponent } from '../core';
import {
  booleanVariant,
  booleanVariantStyles,
  variant,
  variantStyles,
} from '../variants';
import { TestDesignSystem } from './TestDesignSystem';

it('does not show warning on camel cased variant', () => {
  const A = createComponent('div', {
    variants: [
      booleanVariant('isActive', true),
      variant('toggleMode', true, ['a', 'b'] as const),
    ],
  });
  const { getByTestId } = render(
    <TestDesignSystem>
      <A data-testid="A" isActive toggleMode="a" />
    </TestDesignSystem>,
  );

  expect(getByTestId('A')).not.toHaveAttribute('isActive');
  expect(getByTestId('A')).not.toHaveAttribute('toggleMode');
  expect(getByTestId('A')).toHaveAttribute('data-isactive', 'true');
  expect(getByTestId('A')).toHaveAttribute('data-togglemode', 'a');
});

describe('booleanVariant', () => {
  it('lowercases output attribute name', () => {
    expect(booleanVariant('isCamelCase', true)).toEqual({
      prop: 'isCamelCase',
      name: 'iscamelcase',
      stripProp: true,
      defaultValue: false,
    });
  });

  it('accepts default value', () => {
    expect(booleanVariant('isCamelCase', true, undefined)).toEqual({
      prop: 'isCamelCase',
      name: 'iscamelcase',
      stripProp: true,
      defaultValue: false,
    });

    expect(booleanVariant('isCamelCase', true, false)).toEqual({
      prop: 'isCamelCase',
      name: 'iscamelcase',
      stripProp: true,
      defaultValue: false,
    });

    expect(booleanVariant('isCamelCase', true, true)).toEqual({
      prop: 'isCamelCase',
      name: 'iscamelcase',
      stripProp: true,
      defaultValue: true,
    });

    expect(booleanVariant('isCamelCase', true, null)).toEqual({
      prop: 'isCamelCase',
      name: 'iscamelcase',
      stripProp: true,
      defaultValue: null,
    });
  });
});

describe('booleanVariantStyles', () => {
  it('generates style sheet for variant', () => {
    expect(
      booleanVariantStyles('isCamelCase', {
        on: {
          color: 'primary',
        },
        off: {
          color: 'shadesText',
        },
      }),
    ).toEqual({
      '&[data-iscamelcase="true"]': {
        color: 'primary',
      },
      '&[data-iscamelcase="false"]': {
        color: 'shadesText',
      },
    });
  });

  it('ignores style leafs for missing clauses', () => {
    expect(
      booleanVariantStyles('isCamelCase', {
        off: {
          color: 'shadesText',
        },
      }),
    ).toEqual({
      '&[data-iscamelcase="false"]': {
        color: 'shadesText',
      },
    });

    expect(
      booleanVariantStyles('isCamelCase', {
        on: {
          color: 'shadesText',
        },
      }),
    ).toEqual({
      '&[data-iscamelcase="true"]': {
        color: 'shadesText',
      },
    });
  });
});

describe('variant', () => {
  it('lowercases output attribute name', () => {
    expect(variant('buttonSize', true, ['danger', 'success'])).toEqual({
      prop: 'buttonSize',
      name: 'buttonsize',
      stripProp: true,
      defaultValue: 'default',
    });
  });
});

describe('variantStyles', () => {
  it('generates style sheet for variant', () => {
    expect(
      variantStyles('buttonSize', {
        default: {
          color: 'primary',
        },
        danger: {
          color: 'danger',
        },
        success: {
          color: 'success',
        },
      }),
    ).toEqual({
      '&[data-buttonsize="default"]': {
        color: 'primary',
      },
      '&[data-buttonsize="danger"]': {
        color: 'danger',
      },
      '&[data-buttonsize="success"]': {
        color: 'success',
      },
    });
  });
});
