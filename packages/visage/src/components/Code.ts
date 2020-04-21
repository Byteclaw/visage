import { createComponent } from '@byteclaw/visage-core';

/**
 * Code component's styles
 */
export const CodeStyles: VisageStyleSheet = {
  backgroundColor:
    'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
  borderColor:
    'color(shades if(isDark color(shades tint(20%)) color(shades shade(20%))))',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 'controlBorderRadius',
  display: 'inline-block',
  fontSize: 'inherit',
  fontFamily: 'monospace',
  lineHeight: 'inherit',
  px: 1,
  whiteSpace: 'nowrap',
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
  display: 'block',
  overflow: 'auto',
};

export const PreformattedCode = createComponent('pre', {
  displayName: 'PreformattedCode',
  styles: PreformattedCodeStyles,
});
