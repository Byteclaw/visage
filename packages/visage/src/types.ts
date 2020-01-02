import { StyleSheet } from '@byteclaw/visage-core';
import { ScaleValue } from '@byteclaw/visage-utils';
import React from 'react';

export interface ColorPalette {
  /** Accent color to bring attention to design elements */
  lightAccent: string | ScaleValue<string>;
  lightAccentText: string | ScaleValue<string>;
  /** Used as background color for dark on light design or text color of inverted design */
  lightShades: string | ScaleValue<string>;
  lightShadesText: string | ScaleValue<string>;
  primary: string | ScaleValue<string>;
  primaryText: string | ScaleValue<string>;
  /** Alternative accent color */
  darkAccent: string | ScaleValue<string>;
  darkAccentText: string | ScaleValue<string>;
  /** Used as text color for dark on light design or background color of inverted design */
  darkShades: string | ScaleValue<string>;
  darkShadesText: string | ScaleValue<string>;
  /** Uses as background for danger elements or as invalid color */
  danger: string | ScaleValue<string>;
  dangerText: string | ScaleValue<string>;
  /** Uses as background for info elements or as info text color */
  info: string | ScaleValue<string>;
  infoText: string | ScaleValue<string>;
  /** Uses as background for success elements or as success text color */
  success: string | ScaleValue<string>;
  successText: string | ScaleValue<string>;
  /** Text input backgrounds */
  textInput: string | ScaleValue<string>;
  /** Text input border colors */
  textInputBorder: string | ScaleValue<string>;
  /** Uses as background for warning elements or as warning text color */
  warning: string | ScaleValue<string>;
  warningText: string | ScaleValue<string>;
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
