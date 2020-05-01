import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import React, { ReactNode, useMemo } from 'react';
import { createComponent } from '../core';
import { AnchorOrigin } from './shared';

const BadgeContainer = createComponent('span', {
  displayName: 'BadgeContainer',
  styles: {
    display: 'inline-flex',
    position: 'relative',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
});

const getPositioningStyle = (anchorOrigin: AnchorOrigin) => ({
  top: anchorOrigin.vertical === 'top' ? 0 : undefined,
  bottom: anchorOrigin.vertical === 'bottom' ? 0 : undefined,
  left: anchorOrigin.horizontal === 'left' ? 0 : undefined,
  right: anchorOrigin.horizontal === 'right' ? 0 : undefined,
  transform: `translate(${
    anchorOrigin.horizontal === 'right' ? '50%' : '-50%'
  }, ${anchorOrigin.vertical === 'top' ? '-50%' : '50%'})`,
  transformOrigin: `${anchorOrigin.horizontal === 'right' ? '100%' : '0%'} ${
    anchorOrigin.vertical === 'top' ? '0%' : '100%'
  }`,
});

const BadgeContent = createComponent('span', {
  displayName: 'BadgeContent',
  styles: {
    display: 'flex',
    borderRadius: '10px',
    fontFamily: 'heading',
    fontWeight: 600,
    py: 0,
    px: 0.5,
    backgroundColor: 'primary',
    position: 'absolute',
    flexWrap: 'wrap',
    fontSize: -1,
    height: '20px',
    minWidth: '20px',
    transition: 'all 250ms ease-in',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    color: 'primaryText',
  },
});

interface BadgeProps extends ExtractVisageComponentProps<typeof BadgeContent> {
  anchorOrigin?: AnchorOrigin;
  children: ReactNode;
  content: ReactNode;
}

export function Badge({
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  children,
  content,
  styles,
  ...restProps
}: BadgeProps) {
  const contentStyles = useMemo(
    () => ({ ...styles, ...getPositioningStyle(anchorOrigin) }),
    [anchorOrigin, styles],
  );
  return (
    <BadgeContainer>
      <BadgeContent {...restProps} styles={contentStyles}>
        {content}
      </BadgeContent>
      {children}
    </BadgeContainer>
  );
}
