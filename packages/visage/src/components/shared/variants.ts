import { createBooleanVariant, EmotionStyleSheet } from '../../core';

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
