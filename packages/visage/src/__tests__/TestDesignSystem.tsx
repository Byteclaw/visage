import { Theme, StyleGenerator } from '@byteclaw/visage-core';
import { createNPointModularScaleTheme } from '@byteclaw/visage-themes';
import React, { ReactNode } from 'react';
import { createEmotionStyleGenerator } from '../emotionStyleGenerator';
import { DesignSystem } from '../DesignSystem';
import { VisageFaces } from '../faces';

export function createTestTheme(faces?: VisageFaces) {
  return createNPointModularScaleTheme({
    baseFontSize: 16,
    baseLineHeightRatio: 1.6,
    baseGridSize: 8,
    fontScaleRatio: 1.6,
    borderRadius: {
      controlBorderRadius: 4,
    },
    fontFamily: {
      body: 'sans-serif',
      heading: 'serif',
    },
    colors: {
      primaryText: 'white',
      bodyText: 'black',
      primary: {
        values: ['lightblue', 'blue', 'darkblue'],
        offset: 0,
      },
      shades: '#ccc',
      shadesText: '#fff',
      secondary: 'blue',
      accent: 'blue',
      accentText: 'white',
      danger: 'red',
      dangerText: 'white',
      info: 'cyan',
      infoText: 'white',
      neutral: '#eee',
      neutralText: '#000',
      success: 'green',
      successText: 'white',
      warning: 'orange',
      warningText: 'white',
    },
    faces,
  });
}

export const theme = createTestTheme();

interface Props {
  children?: ReactNode;
  is?: number;
  styleGenerator?: StyleGenerator;
  theme?: Theme;
}

const defaultStyleGenerator = createEmotionStyleGenerator();

export function TestDesignSystem({
  children,
  is,
  styleGenerator = defaultStyleGenerator,
  theme: themeOverride = theme,
}: Props) {
  return (
    <DesignSystem is={is} styleGenerator={styleGenerator} theme={themeOverride}>
      {children}
    </DesignSystem>
  );
}
