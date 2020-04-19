import { createComponent } from '../core';

export const KeyboardKeyStyles: VisageStyleSheet = {
  backgroundColor:
    'color(shades if(isDark color(shades tint(5%)) color(shades shade(5%))))',
  borderColor:
    'color(shades if(isDark color(shades tint(15%)) color(shades shade(15%))))',
  borderRadius: 'controlBorderRadius',
  borderStyle: 'solid',
  borderWidth: '1px',
  // this one does not work until https://github.com/Byteclaw/visage/issues/461 is fixed
  // boxShadow: 'inset 0 -1px 0 color(shades if(isDark color(shades tint(15%)) color(shades shade(15%)))',
  color: 'shadesText',
  display: 'inline-block',
  fontFamily: 'monospace',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  px: 1,
  textTransform: 'lowercase',
  whiteSpace: 'nowrap',
};

export const KeyboardKey = createComponent('kbd', {
  displayName: 'KeyboardKey',
  styles: KeyboardKeyStyles,
});
