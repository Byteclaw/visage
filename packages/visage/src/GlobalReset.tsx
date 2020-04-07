import React from 'react';
import { EmotionStyleSheet } from './types';
import { CodeStyles, PreformattedCodeStyles } from './components/Code';
import { HeadingStyles } from './components/Heading';
import { LinkStyles } from './components/Link';
import { ParagraphStyles } from './components/Paragraph';
import { SubscriptStyles, SuperscriptStyles } from './components/Scripts';
import { BlockquoteStyles, CiteStyles } from './components/Quotes';
import {
  EmphasizedTextStyles,
  SmallTextStyles,
  StrongTextStyles,
  TextStyles,
} from './components/Text';
import { GlobalStyles } from './GlobalStyles';

export const globalComponentStyles: {
  [selector: string]: EmotionStyleSheet;
} = {
  body: {
    backgroundColor: 'shades',
  },
  html: {
    backgroundColor: 'shades',
    color: 'shadesText',
    fontFamily: 'body',
    fontSize: 0,
    lineHeight: 0,
  },
  // typography (keep in sync with Visage counterparts)
  a: {
    ...LinkStyles,
    face: 'Link',
  },
  blockquote: {
    ...BlockquoteStyles,
    face: 'Blockquote',
  },
  cite: {
    ...CiteStyles,
    face: 'Cite',
  },
  code: {
    ...CodeStyles,
    face: 'Code',
  },
  i: {
    ...EmphasizedTextStyles,
    face: 'EmphasizedText',
  },
  em: {
    ...EmphasizedTextStyles,
    face: 'EmphasizedText',
  },
  h1: {
    ...HeadingStyles.h1,
    face: 'h1',
  },
  h2: {
    ...HeadingStyles.h2,
    face: 'h2',
  },
  h3: {
    ...HeadingStyles.h3,
    face: 'h3',
  },
  h4: {
    ...HeadingStyles.h4,
    face: 'h4',
  },
  h5: {
    ...HeadingStyles.h5,
    face: 'h5',
  },
  h6: {
    ...HeadingStyles.h6,
    face: 'h6',
  },
  kbd: {
    ...CodeStyles,
    face: 'Code',
  },
  p: {
    ...ParagraphStyles,
    face: 'Paragraph',
  },
  pre: {
    ...PreformattedCodeStyles,
    face: 'PreformattedCode',
  },
  samp: {
    ...CodeStyles,
    face: 'Code',
  },
  small: {
    ...SmallTextStyles,
    face: 'SmallText',
  },
  span: {
    ...TextStyles,
    face: 'Text',
  },
  b: {
    ...StrongTextStyles,
    face: 'StrongText',
  },
  strong: {
    ...StrongTextStyles,
    face: 'StrongText',
  },
  sup: {
    ...SuperscriptStyles,
    face: 'Superscript',
  },
  sub: {
    ...SubscriptStyles,
    face: 'Subscript',
  },
};

const globalStyles: { [selector: string]: EmotionStyleSheet } = {
  '*': {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
  },
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  body: {
    margin: 0,
    width: '100%',
    maxWidth: 'none',
    face: 'body',
  },
  html: {
    boxSizing: 'border-box',
    margin: 0,
    width: '100%',
    maxWidth: 'none',
    // https://github.com/matejlatin/Gutenberg/blob/master/src/style/layout/_base.scss#L22
    msTextSizeAdjust: '100%',
    webkitTextSizeAdjust: '100%',
    textSizeAdjust: '100%',
    face: 'html',
  },
};

/**
 * Visage's global reset
 */
export function GlobalReset() {
  return <GlobalStyles styles={globalStyles} />;
}
