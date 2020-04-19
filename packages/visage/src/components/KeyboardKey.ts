import { createComponent } from '../core';

export const KeyboardKeyStyles: VisageStyleSheet = {
  backgroundColor: 'shades',
  borderRadius: 'keyboardBorderRadius',
  boxShadow:
    '0 0 0 1px color(shades if(isDark color(shades tint(15%)) color(shades shade(15%)))), 0 3px 0 0 shades, 0 3px 0 1px color(shades if(isDark color(shades tint(15%)) color(shades shade(15%))))',
  color: 'shadesText',
  display: 'inline-block',
  fontFamily: 'monospace',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  m: 0,
  p: 0,
  px: 0.5,
  textAlign: 'center',
  textTransform: 'lowercase',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

export const KeyboardKey = createComponent('kbd', {
  displayName: 'KeyboardKey',
  styles: KeyboardKeyStyles,
});
