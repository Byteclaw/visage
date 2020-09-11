import { createComponent } from '../core';
import {
  booleanVariant,
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
      // keep space before , because otherwise danger won't be mapped
      boxShadow: createControlActiveShadow('danger'),
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
  default: {
    backgroundColor: 'accent',
    color: 'accentText',
  },
};

const sizeVariantStyles: { [key: string]: VisageStyleSheet } = {
  small: {
    fontSize: -1,
    py: 0,
    px: 1,
  },
  medium: {
    fontSize: 0,
    py: 1,
    px: 2,
  },
  large: {
    fontSize: 1,
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
      color: 'shades',
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
      color: 'shades',
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
  styles: props => ({
    appearance: 'none',
    alignItems: 'center',
    borderRadius: 'controlBorderRadius',
    border: 'none',
    color: 'primary',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 0,
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
    ...(props.outlined
      ? props.monochrome
        ? monochromeButtonVariants
        : outlinedVariantStyles[props.variant || 'default'] ||
          outlinedVariantStyles.default
      : variantStyles[props.variant || 'default'] || variantStyles.default),
    ...createVariantStyles('size', sizeVariantStyles),
    '&[disabled]': disabledControlStyles,
  }),
  variants: [
    booleanVariant('outlined', true),
    booleanVariant('monochrome', true),
    variant('variant', true, ['danger', 'primary'] as const),
    variant('size', true, ['small', 'medium', 'large'] as const),
  ],
});
