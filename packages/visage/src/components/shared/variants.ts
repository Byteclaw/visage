import { createBooleanVariant, EmotionStyleSheet } from '../../core';

/**
 * Used to mark form control as invalid
 */
export const invalidControl = createBooleanVariant('invalid', {
  onStyles: {
    borderColor: 'red',
    borderWidth: '2px',
    '&:focus': {
      outlineColor: 'blue',
    },
  },
  offStyles: {
    '&:focus, &[data-focused="true"]': {
      outlineColor: 'blue',
    },
  },
});

/**
 * Used to mark form control as disabled
 */
export const disabledControl = createBooleanVariant('disabled', {
  onStyles: {
    color: 'grey.1',
    outlineColor: 'grey.1',
    // applicable to textarea
    resize: 'none',
  },
  stripProp: false,
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
