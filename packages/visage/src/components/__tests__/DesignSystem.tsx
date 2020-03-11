import { createNPointModularScaleTheme } from '@byteclaw/visage-themes';
import React, { ReactNode } from 'react';
import { DesignSystem } from '../..';

const theme = createNPointModularScaleTheme({
  baseFontSize: 16,
  baseLineHeightRatio: 1.6,
  baseGridSize: 8,
  borderRadius: {
    controlBorderRadius: 4,
  },
  fontScaleRatio: 1.6,
  fontFamily: {
    body: 'body-font',
    heading: 'heading-font',
  },
  faces: {},
  mixins: {},
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

export function TestDesignSystem({ children }: { children: ReactNode }) {
  return <DesignSystem theme={theme}>{children}</DesignSystem>;
}
