import { Theme } from '@byteclaw/visage-core';
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
      shades: '#ccc',
      shadesText: '#fff',
      shadesOverlay: '#ddd',
      shadesOverlayText: '#000',
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
      textInput: 'white',
      textInputBorder: 'black',
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
