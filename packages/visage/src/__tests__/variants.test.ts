import {
  booleanVariant,
  booleanVariantStyles,
  variant,
  variantStyles,
} from '../variants';

describe('booleanVariant', () => {
  it('lowercases output attribute name', () => {
    expect(booleanVariant('isCamelCase', true)).toEqual({
      prop: 'isCamelCase',
      name: 'iscamelcase',
      stripProp: true,
      defaultValue: false,
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
