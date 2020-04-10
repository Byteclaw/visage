import { createComponent } from '@byteclaw/visage-core';

const ScriptsStyles: VisageStyleSheet = {
  fontSize: '75%',
  lineHeight: '0px',
  position: 'relative',
  verticalAlign: 'baseline',
};

/**
 * Superscript component's style sheet
 */
export const SuperscriptStyles: VisageStyleSheet = {
  ...ScriptsStyles,
  top: '-0.5em',
};

export const Superscript = createComponent('sup', {
  displayName: 'Superscript',
  styles: SuperscriptStyles,
});

/**
 * Subscript component's style sheet
 */
export const SubscriptStyles: VisageStyleSheet = {
  ...ScriptsStyles,
  bottom: '-0.25em',
};

export const Subscript = createComponent('sub', {
  displayName: 'Subscript',
  styles: SubscriptStyles,
});
