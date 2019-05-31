import { useDesignSystem } from '@byteclaw/visage-core';
import { Global, Interpolation } from '@emotion/core';
import React, { useMemo } from 'react';

export function GlobalReset() {
  const { theme } = useDesignSystem();
  const styles: Interpolation = useMemo(
    () => ({
      '*': {
        boxSizing: 'border-box',
        lineHeight: theme.resolve('lineHeight', 0),
        marginBottom: theme.resolve('lineHeight', 0),
      },
      body: {
        color: theme.resolve('color', 'bodyText'),
        fontFamily: theme.resolve('fontFamily', 'body'),
        margin: 0,
        width: '100%',
        maxWidth: 'none',
      },
      html: {
        fontSize: theme.resolve('fontSize', 0),
        margin: 0,
        width: '100%',
        maxWidth: 'none',
      },
    }),
    [theme],
  );

  return <Global styles={styles} />;
}
