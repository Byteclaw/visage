import { createComponent } from '../core';
import { EmotionStyleSheet } from '../types';

/**
 * Link component's style sheet
 */
export const LinkStyles: EmotionStyleSheet = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  color: 'primary',
  outline: 'none',
};

export const Link = createComponent('a', {
  displayName: 'Link',
  defaultStyles: LinkStyles,
});
