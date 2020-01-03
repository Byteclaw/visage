import { createComponent } from '@byteclaw/visage-core';
import { EmotionStyleSheet } from '../types';

/**
 * Code component's styles
 */
export const CodeStyles: EmotionStyleSheet = {
  fontSize: 'inherit',
  fontFamily: 'monospace',
  lineHeight: 'inherit',
};

export const Code = createComponent('code', {
  displayName: 'Code',
  defaultStyles: CodeStyles,
});

/**
 * PreformattedCode component's styles
 */
export const PreformattedCodeStyles: EmotionStyleSheet = {
  ...CodeStyles,
  overflow: 'auto',
};

export const PreformattedCode = createComponent('pre', {
  displayName: 'PreformattedCode',
  defaultStyles: PreformattedCodeStyles,
});
