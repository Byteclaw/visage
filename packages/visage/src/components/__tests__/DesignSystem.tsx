import React, { ReactNode } from 'react';
import { createNPointTheme, DesignSystem } from '../..';

const theme = createNPointTheme({
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

export function TestDesignSystem({ children }: { children: ReactNode }) {
  return <DesignSystem theme={theme}>{children}</DesignSystem>;
}
