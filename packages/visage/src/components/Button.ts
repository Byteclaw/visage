import { createComponent } from '../core';
import { booleanVariant, variant } from '../variants';
import {
  disabledControlStyles,
  createControlFocusShadow,
  createControlActiveShadow,
  createControlHoverShadow,
} from './shared';
import { EmotionStyleSheet } from '../types';

const variantStyles: { [key: string]: EmotionStyleSheet } = {
  danger: {
    backgroundColor: 'danger',
    color: 'dangerText',
    '&:focus': {
      boxShadow: createControlFocusShadow('danger'),
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
      boxShadow: createControlFocusShadow('primary'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('primary'),
    },
  },
  default: {
    backgroundColor: 'lightAccent',
    color: 'lightAccentText',
  },
};
const outlinedVariantStyles: { [key: string]: EmotionStyleSheet } = {
  danger: {
    backgroundColor: 'transparent',
    borderColor: 'danger',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'lightShadesText',
    '&:focus': {
      boxShadow: createControlFocusShadow('danger'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('danger'),
    },
  },
  primary: {
    backgroundColor: 'transparent',
    borderColor: 'primary',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'lightShadesText',
    '&:focus': {
      boxShadow: createControlFocusShadow('primary'),
    },
    // because we need to compose box shadow
    '&:focus:active': {
      boxShadow: createControlActiveShadow('primary'),
    },
  },
  default: {
    backgroundColor: 'transparent',
    borderColor: 'lightAccent',
    borderStyle: 'solid',
    borderWidth: 2,
    color: 'lightShadesText',
  },
};
const monochromeButtonVariants: EmotionStyleSheet = {
  backgroundColor: 'transparent',
  color: 'currentColor',
  borderColor: 'currentColor',
  borderStyle: 'solid',
  borderWidth: 2,
  '&:focus': {
    boxShadow: createControlFocusShadow('currentColor'),
  },
  // because we need to compose box shadow
  '&:focus:active': {
    boxShadow: createControlActiveShadow('currentColor'),
  },
};

export const Button = createComponent('button', {
  displayName: 'Button',
  defaultStyles: props => ({
    alignItems: 'center',
    borderRadius: 'controlBorderRadius',
    border: 'none',
    color: 'primary',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 0,
    fontFamily: 'body',
    fontWeight: 'normal',
    justifyContent: 'space-between',
    minHeight: '2rem',
    maxWidth: '20rem',
    m: 0.5,
    outline: 'none',
    py: 1,
    px: 2,
    position: 'relative',
    textDecoration: 'none',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-out',
    verticalAlign: 'middle',
    '&:hover': {
      boxShadow: createControlHoverShadow(),
    },
    '&:focus': {
      zIndex: 1, // for button group
      boxShadow: createControlFocusShadow(),
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
    '&[disabled]': disabledControlStyles,
  }),
  variants: [
    booleanVariant('outlined', true),
    booleanVariant('monochrome', true),
    variant('variant', true, ['danger', 'primary'] as const),
  ],
});
