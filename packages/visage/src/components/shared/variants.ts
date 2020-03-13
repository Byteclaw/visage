import { booleanVariant } from '../../variants';
import { EmotionStyleSheet } from '../../types';

/**
 * Control focus shadow that is used to compose actual focus shadow (needs a color at the end)
 *
 * The white color works as some sort of opacity
 */
export const controlFocusShadow =
  '0 0 0 4px rgba(255, 255, 255, 0.4), 0 0 0 4px';
export const controlHoverShadow = 'inset 0 0 200px rgba(68, 68, 68, 0.1)';
export const controlActiveShadow =
  'inset 0 0 200px rgba(68, 68, 68, 0.2), inset 0 0 2px rgba(0, 0, 0, 0.2)';

export const createSurfaceFocusShadow = (
  color: string = 'lightAccent',
  withHoverShadow: boolean = true,
): string =>
  withHoverShadow
    ? `${controlFocusShadow} ${color}, ${controlHoverShadow}`
    : `${controlFocusShadow} ${color}`;

export const createControlFocusShadow = (
  color: string = 'lightAccent',
): string => `${controlFocusShadow} ${color}`;

export const createControlHoverShadow = (): string => controlHoverShadow;
export const createControlActiveShadow = (
  color: string = 'lightAccent',
): string => `${controlFocusShadow} ${color} , ${controlActiveShadow}`;

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
  cursor: 'default',
  pointerEvents: 'none',
  // applicable to textarea
  resize: 'none',
  opacity: 0.5,
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
