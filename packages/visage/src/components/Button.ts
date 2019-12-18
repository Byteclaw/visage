import { createComponent } from '../core';
import { booleanVariant, variant } from '../variants';
import { EmotionStyleSheet } from '../types';

const variantStyles: { [key: string]: EmotionStyleSheet } = {
  danger: {
    backgroundColor: 'danger',
    borderColor: 'danger',
    color: 'dangerText',
    '&:not([disabled]):hover': {
      backgroundColor: 'danger.-2',
      borderColor: 'danger.-2',
      color: 'dangerText.-2',
    },
    '&:not([disabled]):focus': {
      backgroundColor: 'danger.-4',
      color: 'dangerText.-4',
    },
    '&:not([disabled]):active': {
      backgroundColor: 'danger.-3',
      color: 'dangerText.-3',
    },
  },
  primary: {
    backgroundColor: 'primary',
    borderColor: 'primary',
    color: 'primaryText',
    '&:not([disabled]):hover': {
      backgroundColor: 'primary.-2',
      color: 'primaryText.-2',
    },
    '&:not([disabled]):focus': {
      backgroundColor: 'primary.-4',
      color: 'primaryText.-4',
    },
    '&:not([disabled]):active': {
      backgroundColor: 'primary.-3',
      color: 'primaryText.-3',
      outlineWidth: 2,
    },
  },
  default: {
    backgroundColor: 'lightAccent',
    color: 'lightAccentText',
    '&:not([disabled]):hover': {
      backgroundColor: 'lightAccent.-2',
      color: 'lightAccentText.-2',
    },
    '&:not([disabled]):focus': {
      backgroundColor: 'lightAccent.-4',
      color: 'lightAccentText.-4',
    },
    '&:not([disabled]):active': {
      backgroundColor: 'lightAccent.-3',
      color: 'lightAccentText.-3',
    },
  },
};
const outlinedVariantStyles: { [key: string]: EmotionStyleSheet } = {
  danger: {
    backgroundColor: 'transparent',
    borderColor: 'danger',
    color: 'bodyText',
    '&:not([disabled]):hover': {
      borderColor: 'danger.-1',
      outlineColor: 'danger.-1',
    },
    '&:not([disabled]):focus': {
      borderColor: 'danger.-3',
      outlineColor: 'danger.-3',
    },
    '&:not([disabled]):active': {
      borderColor: 'danger.-2',
      outlineColor: 'danger.-2',
      outlineWidth: 2,
    },
  },
  primary: {
    backgroundColor: 'transparent',
    borderColor: 'primary',
    color: 'bodyText',
    '&:not([disabled]):hover': {
      borderColor: 'primary.-1',
      outlineColor: 'primary.-1',
    },
    '&:not([disabled]):focus': {
      borderColor: 'primary.-3',
      outlineColor: 'primary.-3',
    },
    '&:not([disabled]):active': {
      borderColor: 'primary.-2',
      outlineColor: 'primary.-2',
      outlineWidth: 2,
    },
  },
  default: {
    backgroundColor: 'transparent',
    borderColor: 'lightAccent',
    color: 'bodyText',
    '&:not([disabled]):hover': {
      borderColor: 'lightAccent.-1',
      outlineColor: 'lightAccent.-1',
    },
    '&:not([disabled]):focus': {
      borderColor: 'lightAccent.-3',
      outlineColor: 'lightAccent.-3',
    },
    '&:not([disabled]):active': {
      borderColor: 'lightAccent.-2',
      outlineColor: 'lightAccent.-2',
      outlineWidth: 2,
    },
  },
};
const monochromeButtonVariants: EmotionStyleSheet = {
  backgroundColor: 'transparent',
  color: 'currentColor',
  borderColor: 'currentColor',
  '&:not([disabled]):hover, &:not([disabled]):focus': {
    outlineColor: 'currentColor',
  },
  '&:not([disabled]):active': {
    outlineWidth: 2,
  },
};

export const Button = createComponent('button', {
  displayName: 'Button',
  defaultStyles: props => ({
    alignItems: 'center',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderRadius: 0,
    borderWidth: 2,
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
    outlineStyle: 'solid',
    outlineColor: 'transparent',
    outlineWidth: 1,
    p: 1,
    position: 'relative',
    textDecoration: 'none',
    verticalAlign: 'middle',
    '&:focus': {
      boxShadow: '0 0 0 3px darkAccent',
    },
    // only outlined buttons can be monochrome
    ...(props.outlined
      ? props.monochrome
        ? monochromeButtonVariants
        : outlinedVariantStyles[props.variant || 'default'] ||
          outlinedVariantStyles.default
      : variantStyles[props.variant || 'default'] || variantStyles.default),
    '&[disabled]': {
      cursor: 'not-allowed',
      opacity: 0.2,
    },
  }),
  variants: [
    booleanVariant('outlined', true),
    booleanVariant('monochrome', true),
    variant('variant', true, ['danger', 'primary'] as const),
  ],
});
