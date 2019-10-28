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
  defaultStyles: props => ({
    borderColor: 'white',
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 2,
    display: 'inline-flex',
    fontSize: -1,
    lineHeight: -1,
    px: 1,
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
