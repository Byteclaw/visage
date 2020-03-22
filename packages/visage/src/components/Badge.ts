import { createComponent } from '../core';
import { variant } from '../variants';
import { EmotionStyleSheet } from '../types';

const alignVariants = {
  left: { marginRight: 'auto' } as EmotionStyleSheet,
  right: { marginLeft: 'auto' } as EmotionStyleSheet,
  default: {} as EmotionStyleSheet,
};

const variantStyles: { [key: string]: EmotionStyleSheet } = {
  danger: {
    backgroundColor: 'danger',
    color: 'dangerText',
  },
  info: {
    backgroundColor: 'info',
    color: 'infoText',
  },
  success: {
    backgroundColor: 'success',
    color: 'successText',
  },
  warning: {
    backgroundColor: 'warning',
    color: 'warningText',
  },
  default: {
    backgroundColor: 'neutral',
    color: 'neutralText',
  },
};

export const Badge = createComponent('span', {
  displayName: 'Badge',
  styles: props => ({
    borderColor: 'white',
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 0,
    display: 'inline-flex',
    fontSize: -2,
    lineHeight: -2,
    px: 1,
    py: 0.2,
    ...(props.align ? alignVariants[props.align] : {}),
    ...(variantStyles[props.variant || 'default'] || variantStyles.default),
  }),
  variants: [
    variant('align', true, ['left', 'right', 'default'] as const),
    variant('variant', true, [
      'danger',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});
