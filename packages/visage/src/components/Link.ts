import { createComponent } from '../core';
import { EmotionStyleSheet } from '../types';
import { createControlActiveShadow, createControlFocusShadow } from './shared';

/**
 * Link component's style sheet
 */
export const LinkStyles: EmotionStyleSheet = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  color: 'primary',
  outline: 'none',
  '&:focus': {
    boxShadow: createControlFocusShadow(undefined, false),
  },
  '&:active': {
    boxShadow: createControlActiveShadow(),
  },
};

export const Link = createComponent('a', {
  displayName: 'Link',
  defaultStyles: LinkStyles,
});
