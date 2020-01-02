import { useDesignSystem, Theme } from '@byteclaw/visage-core';
import { Global } from '@emotion/core';
import React, { useMemo } from 'react';

export function GlobalReset() {
  const { breakpoint, theme } = useDesignSystem<Theme>();
  const styles = useMemo(
    (): any => ({
      '*': {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      },
      '*, *::before, *::after': {
        boxSizing: 'inherit',
        lineHeight: theme.resolve('lineHeight', 0, breakpoint).value,
        // padding: '0.05px', // prevent margin collapsing between parent and child
      },
      body: {
        backgroundColor: theme.resolve('color', 'lightShades', breakpoint)
          .value,
        color: theme.resolve('color', 'lightShadesText', breakpoint).value,
        fontFamily: theme.resolve('fontFamily', 'body', breakpoint).value,
        margin: 0,
        width: '100%',
        maxWidth: 'none',
      },
      html: {
        backgroundColor: theme.resolve('color', 'lightShades', breakpoint)
          .value,
        boxSizing: 'border-box',
        fontSize: theme.resolve('fontSize', 0, breakpoint).value,
        margin: 0,
        width: '100%',
        maxWidth: 'none',
      },
    }),
    [breakpoint, theme],
  );

  return <Global styles={styles} />;
}
