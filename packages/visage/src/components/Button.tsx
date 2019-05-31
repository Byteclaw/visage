import React, { ComponentProps, useMemo } from 'react';
import { createComponent } from '../core';

const ButtonBase = createComponent('button', {
  displayName: 'ButtonBase',
  defaultProps: {
    styles: {
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderRadius: 3,
      borderWidth: 0,
      color: 'primary',
      cursor: 'pointer',
      display: 'inline-block',
      fontSize: 0,
      fontWeight: 'normal',
      margin: -1,
      padding: -1,
      textDecoration: 'none',
    },
  },
});

export function Button({
  variant,
  ...restProps
}: ComponentProps<typeof ButtonBase> & { variant?: 'primary' }) {
  const variantStyleProps = useMemo(() => {
    if (variant === 'primary') {
      return {
        styles: {
          backgroundColor: 'primary',
          borderColor: 'primary',
          color: 'primaryText',
        },
      };
    }

    return {};
  }, [variant]);

  return <ButtonBase {...restProps} {...variantStyleProps} />;
}
