import { useDesignSystem } from '@byteclaw/visage-core';
import { Global, Interpolation } from '@emotion/core';
import React, { useMemo } from 'react';

export function GlobalReset() {
  const { theme } = useDesignSystem();
  const styles: Interpolation = useMemo(
    () => ({
      '*, *:before, *:after': {
        boxSizing: 'inherit',
        lineHeight: theme.resolve('lineHeight', 0, undefined, {}, {}),
        padding: '0.05px', // prevent margin collapsing between parent and child
      },
      body: {
        color: theme.resolve('color', 'bodyText', undefined, {}, {}),
        fontFamily: theme.resolve('fontFamily', 'body', undefined, {}, {}),
        margin: 0,
        width: '100%',
        maxWidth: 'none',
      },
      html: {
        boxSizing: 'border-box',
        fontSize: theme.resolve('fontSize', 0, undefined, {}, {}),
        margin: 0,
        width: '100%',
        maxWidth: 'none',
      },
    }),
    [theme],
  );

  return <Global styles={styles} />;
}
