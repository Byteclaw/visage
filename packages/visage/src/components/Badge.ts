import { createComponent } from '../core';
import { variant, variantStyles } from '../variants';

export const Badge = createComponent('span', {
  displayName: 'Badge',
  defaultStyles: {
    borderColor: 'white',
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 2,
    display: 'inline-flex',
    fontSize: -1,
    lineHeight: -1,
    px: 1,
    ...variantStyles('align', {
      left: {
        marginRight: 'auto',
      },
      right: {
        marginLeft: 'auto',
      },
      default: {},
    }),
    ...variantStyles('variant', {
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
    }),
  },
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
