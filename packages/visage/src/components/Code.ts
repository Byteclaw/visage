import { createComponent } from '@byteclaw/visage-core';

/**
 * Code component's styles
 */
export const CodeStyles: VisageStyleSheet = {
  fontSize: 'inherit',
  fontFamily: 'monospace',
  lineHeight: 'inherit',
};

export const Code = createComponent('code', {
  displayName: 'Code',
  styles: CodeStyles,
});

/**
 * PreformattedCode component's styles
 */
export const PreformattedCodeStyles: VisageStyleSheet = {
  ...CodeStyles,
  overflow: 'auto',
};

export const PreformattedCode = createComponent('pre', {
  displayName: 'PreformattedCode',
  styles: PreformattedCodeStyles,
});
