import { booleanVariant } from '../../variants';
import { EmotionStyleSheet } from '../../types';

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

export const disabledControlStyles: EmotionStyleSheet = {
  color: 'neutral.1',
  cursor: 'not-allowed',
  outlineColor: 'neutral.1',
  // applicable to textarea
  resize: 'none',
  // checkbox, radio
  '&::before': {
    borderColor: 'neutral.1',
  },
  // checkbox, radio
  '&::after': {
    borderColor: 'neutral.1',
  },
  opacity: 0.3,
};

export const invalidControlStyles: EmotionStyleSheet = {
  borderColor: 'danger',
  borderWidth: '2px',
  // data-focused is used by text input on base
  '&:focus, &[data-focused="true"]': {
    boxShadow: '0 0 0 3px darkAccent',
  },
  // checkbox and radio
  '&::before': {
    borderColor: 'danger',
    borderWidth: '2px',
  },
};

/**
 * Uses hidden prop to visually hide element
 * hidden prop is then stripped from underlying component
 */
export const visuallyHiddenBooleanVariant = booleanVariant('hidden', true);
/**
 * Uses hidden prop to visually hide element
 * hidden prop is then stripped from underlying component
 */
export const visuallyHiddenBooleanNonStrippedVariant = booleanVariant(
  'hidden',
  false,
);

/**
 * Used to mark form control as disabled and keeps disabled prop
 */
export const disabledControlBooleanVariant = booleanVariant('disabled', false);

/**
 * Used to mark form control as invalid and strips the prop
 */
export const invalidControlBooleanVariant = booleanVariant('invalid', true);
