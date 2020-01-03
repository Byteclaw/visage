import React from 'react';
import { EmotionStyleSheet } from './types';
import { GlobalStyles } from './GlobalStyles';

const globalStyles: EmotionStyleSheet = {
  '*': {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
  },
  '*, *::before, *::after': {
    boxSizing: 'inherit',
    lineHeight: 0,
    // padding: '0.05px', // prevent margin collapsing between parent and child
  },
  body: {
    backgroundColor: 'lightShades',
    color: 'lightShadesText',
    fontFamily: 'body',
    margin: 0,
    width: '100%',
    maxWidth: 'none',
  },
  html: {
    backgroundColor: 'lightShades',
    boxSizing: 'border-box',
    fontSize: 0,
    margin: 0,
    width: '100%',
    maxWidth: 'none',
  },
};

/**
 * Visage's global reset
 */
export function GlobalReset() {
  return <GlobalStyles styles={globalStyles} />;
}
