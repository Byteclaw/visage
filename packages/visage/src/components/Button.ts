import { createComponent } from '../core';
import {
  booleanVariant,
  booleanVariantStyles,
  variant,
  variantStyles as createVariantStyles,
} from '../variants';
import {
  disabledControlStyles,
  createControlActiveShadow,
  createControlHoverShadow,
  createSurfaceFocusShadow,
} from './shared';

const variantStyles: { [key: string]: VisageStyleSheet } = {
  danger: {
    backgroundColor: 'danger',
    color: 'dangerText',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('danger'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('danger'),
    },
  },
  info: {
    backgroundColor: 'info',
    color: 'infoText',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('info'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('info'),
    },
  },
  primary: {
    backgroundColor: 'primary',
    color: 'primaryText',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('primary'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('primary'),
    },
  },
  success: {
    backgroundColor: 'success',
    color: 'successText',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('success'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('success'),
    },
  },
  warning: {
    backgroundColor: 'warning',
    color: 'warningText',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('warning'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('warning'),
    },
  },
  default: {
    backgroundColor: 'accent',
    color: 'accentText',
  },
};

const sizeVariantStyles: { [key: string]: VisageStyleSheet } = {
  small: {
    fontSize: -1,
    lineHeight: -1,
    py: 0,
    px: 1,
  },
  medium: {
    fontSize: 0,
    lineHeight: 0,
    py: 1,
    px: 2,
  },
  large: {
    fontSize: 1,
    lineHeight: 1,
    py: 1.5,
    px: 2.5,
  },
  default: {},
};

const outlinedVariantStyles: { [key: string]: VisageStyleSheet } = {
  danger: {
    backgroundColor: 'transparent',
    borderColor: 'danger',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'danger',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('danger'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('danger'),
    },
    '&:hover': {
      backgroundColor: 'danger',
      color: 'dangerText',
    },
  },
  info: {
    backgroundColor: 'transparent',
    borderColor: 'info',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'info',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('info'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('info'),
    },
    '&:hover': {
      backgroundColor: 'info',
      color: 'infoText',
    },
  },
  primary: {
    backgroundColor: 'transparent',
    borderColor: 'primary',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'primary',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('primary'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('primary'),
    },
    '&:hover': {
      backgroundColor: 'primary',
      color: 'primaryText',
    },
  },
  success: {
    backgroundColor: 'transparent',
    borderColor: 'success',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'success',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('success'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('success'),
    },
    '&:hover': {
      backgroundColor: 'success',
      color: 'successText',
    },
  },
  warning: {
    backgroundColor: 'transparent',
    borderColor: 'warning',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'warning',
    '&:focus': {
      boxShadow: createSurfaceFocusShadow('warning'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('warning'),
    },
    '&:hover': {
      backgroundColor: 'warning',
      color: 'warningText',
    },
  },
  default: {
    backgroundColor: 'transparent',
    borderColor: 'accent',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'shadesText',
  },
};
const monochromeButtonVariants: VisageStyleSheet = {
  backgroundColor: 'transparent',
  color: 'currentColor',
  borderColor: 'currentColor',
  borderStyle: 'solid',
  borderWidth: 2,
  '&:hover': {
    opacity: 0.5,
  },
  '&:focus': {
    boxShadow: createSurfaceFocusShadow('currentColor'),
  },
  // because we need to compose box shadow
  '&:focus:active': {
    boxShadow: createControlActiveShadow('currentColor'),
  },
};

export const Button = createComponent('button', {
  displayName: 'Button',
  styles: {
    appearance: 'none',
    alignItems: 'center',
    borderRadius: 'controlBorderRadius',
    border: 'none',
    color: 'primary',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    fontFamily: 'body',
    fontWeight: 600,
    justifyContent: 'center',
    minHeight: '2rem',
    minWidth: '4rem',
    outline: 'none',
    m: 0,
    py: 1,
    px: 2,
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-out',
    verticalAlign: 'middle',
    '&:hover': {
      boxShadow: createControlHoverShadow(),
      textDecoration: 'none',
    },
    '&:focus': {
      zIndex: 1, // for button group
      boxShadow: createSurfaceFocusShadow(),
    },
    // because we need to compose box shadow
    '&:active:focus': {
      zIndex: 1,
      boxShadow: createControlActiveShadow(),
    },
    // only outlined buttons can be monochrome
    ...booleanVariantStyles('outlined', {
      on: booleanVariantStyles('monochrome', {
        on: monochromeButtonVariants,
        off: createVariantStyles('variant', outlinedVariantStyles),
      }),
      off: createVariantStyles('variant', variantStyles),
    }),
    ...createVariantStyles('size', sizeVariantStyles),
    '&[disabled]': disabledControlStyles,
  },
  variants: [
    booleanVariant('outlined', true),
    booleanVariant('monochrome', true),
    variant('variant', true, [
      'danger',
      'primary',
      'info',
      'success',
      'warning',
    ] as const),
    variant('size', true, ['small', 'medium', 'large'] as const),
  ],
});
