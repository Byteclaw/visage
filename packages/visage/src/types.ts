import { StyleSheet } from '@byteclaw/visage-core';
import { ScaleValue } from '@byteclaw/visage-utils';
import React from 'react';

export interface ColorPalette {
  /** Accent color to bring attention to design elements */
  lightAccent: string;
  /** Used as background color for dark on light design or text color of inverted design */
  lightShades: string;
  primary: string;
  /** Alternative accent color */
  darkAccent: string;
  /** Used as text color for dark on light design or background color of inverted design */
  darkShades: string;
  [extra: string]: undefined | string | ScaleValue<string>;
}

export type EmotionStyleSheet = StyleSheet<StyleProps>;

export interface StyleProps extends React.CSSProperties {
  /**
   * Calculates fontSize and lineHeight to be the same (based on modular scale = lineHeight)
   * This is needed if wan't bigger icon than fontSize for given lineHeight (sets them to same value)
   */
  iconSize?: number | string;
  /**
   * Use same value as for line height to set a height of an element
   */
  linedHeight?: number | string;
  /**
   * Use same value as for line height to set a width of an element
   */
  linedWidth?: number | string;
  m?: string | number;
  my?: string | number;
  mx?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  mt?: string | number;
  p?: string | number;
  py?: string | number;
  px?: string | number;
  pb?: string | number;
  pl?: string | number;
  plOffset?: string | number;
  prOffset?: string | number;
  pr?: string | number;
  pt?: string | number;
}
