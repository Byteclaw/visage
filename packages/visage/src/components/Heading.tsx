import React, { ComponentProps, useMemo } from 'react';
import { createComponent } from '../core';

const HeadingBase = createComponent('h1', {
  displayName: 'HeadingBase',
  defaultProps: {
    styles: {
      fontFamily: 'heading',
    },
  },
});

interface HeadingProps {
  /** heading level from 1 to 6 */
  level?: number;
}

export function Heading({
  level = 1,
  styles,
  ...restProps
}: ComponentProps<typeof HeadingBase> & HeadingProps) {
  const typographicStyles = useMemo(() => {
    switch (level) {
      case 1: {
        return {
          fontSize: 4,
          lineHeight: 4,
          marginTop: 0,
          marginBottom: -1,
          fontWeight: 'normal',
          ...styles,
        };
      }
      case 2: {
        return {
          fontSize: 3,
          lineHeight: 3,
          marginTop: -1,
          marginBottom: -1,
          fontWeight: 'normal',
          ...styles,
        };
      }
      case 3: {
        return {
          fontSize: 2,
          lineHeight: 2,
          marginTop: -1,
          marginBottom: -1,
          fontWeight: 'normal',
          ...styles,
        };
      }
      case 4: {
        return {
          fontSize: 1,
          lineHeight: 1,
          marginTop: -1,
          marginBottom: -1,
          fontWeight: 'normal',
          ...styles,
        };
      }
      case 5: {
        return {
          fontSize: 0,
          lineHeight: 0,
          fontWeight: 'normal',
          marginTop: -1,
          marginBottom: -1,
          ...styles,
        };
      }
      default: {
        return {
          fontSize: 0,
          lineHeight: 0,
          fontWeight: 'normal',
          fontStyle: 'italic',
          marginTop: -1,
          marginBottom: -1,
          ...styles,
        };
      }
    }
  }, [level, styles]);

  return <HeadingBase styles={typographicStyles} {...restProps} />;
}
