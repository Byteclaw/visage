import { createBooleanVariant, EmotionStyleSheet } from '../../core';

/**
 * Used to mark form control as invalid
 */
export const invalidControl = createBooleanVariant('invalid', {
  onStyles: {
    borderColor: 'red',
    borderWidth: '2px',
    // data-focused is used by text input on base
    '&:focus, &[data-focused="true"]': {
      outlineColor: 'blue',
    },
    // checkbox and radio
    '&::before': {
      borderColor: 'red',
      borderWidth: '2px',
    },
  },
  offStyles: {
    '&:focus, &[data-focused="true"]': {
      outlineColor: 'blue',
    },
  },
});

export const disabledControlStyles: EmotionStyleSheet = {
  color: 'grey.1',
  cursor: 'not-allowed',
  outlineColor: 'grey.1',
  // applicable to textarea
  resize: 'none',
  // checkbox, radio
  '&::before': {
    borderColor: 'grey.1',
  },
  // checkbox, radio
  '&::after': {
    borderColor: 'grey.1',
  },
};

/**
 * Used to mark form control as disabled
 */
export const disabledControl = createBooleanVariant('disabled', {
  onStyles: disabledControlStyles,
  stripProp: false,
});

/**
 * Used to mark form control as disabled but strips the disabled prop
 */
export const disabledControlStripped = createBooleanVariant('disabled', {
  onStyles: disabledControlStyles,
  stripProp: true,
});

export const visuallyHiddenStyles: EmotionStyleSheet = {
  border: '0',
  clip: 'rect(0, 0, 0, 0)',
  height: '1px',
  overflow: 'hidden',
  margin: '-1px',
  padding: '0px',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
};

/**
 * Uses hidden prop to visually hide element
 * hidden prop is then stripped from underlying component
 */
export const visuallyHiddenStripped = createBooleanVariant('hidden', {
  stripProp: true,
  onStyles: visuallyHiddenStyles,
});

/**
 * Uses hidden prop to visually hide element
 * hidden prop is then stripped from underlying component
 */
export const visuallyHiddenNonStripped = createBooleanVariant('hidden', {
  stripProp: false,
  onStyles: visuallyHiddenStyles,
});
