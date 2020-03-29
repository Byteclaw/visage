import { useDesignSystem, Theme } from '@byteclaw/visage-core';
import { Global } from '@emotion/core';
import React, { useMemo } from 'react';
import { EmotionStyleSheet } from './types';

interface GlobalStylesProps {
  styles?: { [selector: string]: EmotionStyleSheet };
}

/**
 * Allows to apply visage style sheet to global styles
 */
export function GlobalStyles({ styles = {} }: GlobalStylesProps) {
  const ctx = useDesignSystem<Theme>();
  const globalStyles = useMemo(() => ctx.resolveStyleSheets([styles]), [
    ctx.resolveStyleSheets,
    styles,
  ]);

  return <Global styles={globalStyles} />;
}
