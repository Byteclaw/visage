import { createComponent } from '@byteclaw/visage-core';
import { EmotionStyleSheet } from '../types';

const ScriptsStyles: EmotionStyleSheet = {
  fontSize: '75%',
  lineHeight: '0px',
  position: 'relative',
  verticalAlign: 'baseline',
};

/**
 * Superscript component's style sheet
 */
export const SuperscriptStyles: EmotionStyleSheet = {
  ...ScriptsStyles,
  top: '-0.5em',
};

export const Superscript = createComponent('sup', {
  displayName: 'Superscript',
  defaultStyles: SuperscriptStyles,
});

/**
 * Subscript component's style sheet
 */
export const SubscriptStyles: EmotionStyleSheet = {
  ...ScriptsStyles,
  bottom: '-0.25em',
};

export const Subscript = createComponent('sub', {
  displayName: 'Subscript',
  defaultStyles: SubscriptStyles,
});
