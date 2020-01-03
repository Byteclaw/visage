import {
  resolveStyleSheet,
  useDesignSystem,
  useMemoizedCall,
  Theme,
} from '@byteclaw/visage-core';
import { Global } from '@emotion/core';
import React from 'react';
import { EmotionStyleSheet } from './types';

interface GlobalStylesProps {
  styles?: EmotionStyleSheet;
}

/**
 * Allows to apply visage style sheet to global styles
 */
export function GlobalStyles({ styles = {} }: GlobalStylesProps) {
  const { breakpoint, theme } = useDesignSystem<Theme>();
  const styleSheet = useMemoizedCall(
    resolveStyleSheet,
    styles,
    breakpoint,
    theme,
  );

  return <Global styles={styleSheet} />;
}
