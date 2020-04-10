import { createComponent } from '../core';

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
  '&:hover': {
    textDecoration: 'underline',
  },
};

export const Link = createComponent('a', {
  displayName: 'Link',
  styles: LinkStyles,
});
