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

const globalStyles: { [selector: string]: EmotionStyleSheet } = {
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
    margin: 0,
    width: '100%',
    maxWidth: 'none',
  },
  html: {
    backgroundColor: 'lightShades',
    color: 'lightShadesText',
    boxSizing: 'border-box',
    fontFamily: 'body',
    fontSize: 0,
    margin: 0,
    width: '100%',
    maxWidth: 'none',
    // https://github.com/matejlatin/Gutenberg/blob/master/src/style/layout/_base.scss#L22
    msTextSizeAdjust: '100%',
    webkitTextSizeAdjust: '100%',
    textSizeAdjust: '100%',
  },
  // typography (keep in sync with Visage counterparts)
  a: LinkStyles,
  blockquote: BlockquoteStyles,
  cite: CiteStyles,
  code: CodeStyles,
  i: EmphasizedTextStyles,
  em: EmphasizedTextStyles,
  h1: HeadingStyles.h1,
  h2: HeadingStyles.h2,
  h3: HeadingStyles.h3,
  h4: HeadingStyles.h4,
  h5: HeadingStyles.h5,
  h6: HeadingStyles.h6,
  kbd: CodeStyles,
  p: ParagraphStyles,
  pre: PreformattedCodeStyles,
  samp: CodeStyles,
  small: SmallTextStyles,
  span: TextStyles,
  b: StrongTextStyles,
  strong: StrongTextStyles,
  sup: SuperscriptStyles,
  sub: SubscriptStyles,
};

/**
 * Visage's global reset
 */
export function GlobalReset() {
  return <GlobalStyles styles={globalStyles} />;
}
