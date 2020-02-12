import { createComponent } from '@byteclaw/visage-core';
import { EmotionStyleSheet } from '../types';

/**
 * Blockquote component's style sheet
 */
export const BlockquoteStyles: EmotionStyleSheet = {
  fontStyle: 'italic',
  pl: 2,
};

export const Blockquote = createComponent('blockquote', {
  displayName: 'Blockquote',
  defaultStyles: BlockquoteStyles,
});

/**
 * Cite component's style sheet
 */
export const CiteStyles: EmotionStyleSheet = {
  fontStyle: 'italic',
};

export const Cite = createComponent('cite', {
  displayName: 'Cite',
  defaultStyles: CiteStyles,
});

/**
 * Quote component's style sheet
 */
export const QuoteStyles: EmotionStyleSheet = {
  fontStyle: 'italic',
};

export const Quote = createComponent('q', {
  displayName: 'Quote',
  defaultStyles: QuoteStyles,
});