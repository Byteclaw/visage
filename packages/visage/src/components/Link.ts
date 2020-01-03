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
  '&:hover': {
    color: 'primary.-1',
  },
  '&:focus': {
    color: 'primary.-2',
    outlineColor: 'primary.-2',
  },
  '&:active': {
    color: 'primary.-3',
    outlineColor: 'primary.-3',
  },
};

export const Link = createComponent('a', {
  displayName: 'Link',
  defaultStyles: LinkStyles,
});
