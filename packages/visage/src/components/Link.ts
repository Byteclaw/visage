import { createComponent } from '../core';
import { EmotionStyleSheet } from '../types';
import {
  createControlActiveShadow,
  createControlHoverShadow,
  createControlFocusShadow,
} from './shared';

/**
 * Link component's style sheet
 */
export const LinkStyles: EmotionStyleSheet = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  color: 'primary',
  outline: 'none',
  '&:hover': {
    boxShadow: createControlHoverShadow(),
  },
  '&:focus': {
    boxShadow: createControlFocusShadow(),
  },
  '&:active': {
    boxShadow: createControlActiveShadow(),
  },
};

export const Link = createComponent('a', {
  displayName: 'Link',
  defaultStyles: LinkStyles,
});
