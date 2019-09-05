import { createComponent, createVariant } from '../core';

export const Badge = createVariant(
  createComponent('span', {
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
    },
  }),
  'variant',
  {
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
  },
);
