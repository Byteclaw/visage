import { DesignSystem, Theme } from '@byteclaw/visage-core';
import React, { ReactNode } from 'react';
import { createNPointTheme } from '../createNPointTheme';
import { createEmotionStyleGenerator } from '../emotionStyleGenerator';

export const theme = createNPointTheme({
  baseFontSize: 16,
  baseLineHeightRatio: 1.6,
  baselineGridSize: 8,
  fontScaleRatio: 1.6,
  fontFamily: {
    body: 'body-font',
    heading: 'heading-font',
  },
  colors: {
    primaryText: 'white',
    bodyText: 'black',
    primary: {
      values: ['light-blue', 'blue', 'dark-blue'],
      offset: 0,
    },
    secondary: 'blue',
  },
});

interface Props {
  children?: ReactNode;
  is?: number;
  theme?: Theme;
}

const styleGenerator = createEmotionStyleGenerator();

export function TestDesignSystem({
  children,
  is,
  theme: themeOverride = theme,
}: Props) {
  return (
    <DesignSystem is={is} styleGenerator={styleGenerator} theme={themeOverride}>
      {children}
    </DesignSystem>
  );
}
