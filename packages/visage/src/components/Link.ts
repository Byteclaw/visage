import { createComponent } from '../core';
import { createSurfaceFocusShadow } from './shared';

/**
 * Link component's style sheet
 */
export const LinkStyles: VisageStyleSheet = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  color: 'primary',
  outline: 'none',
  textDecoration: 'none',
  '&:focus': {
    boxShadow: createSurfaceFocusShadow(),
  },
  '&:hover': {
    textDecoration: 'underline',
  },
};

export const Link = createComponent('a', {
  displayName: 'Link',
  styles: LinkStyles,
});
