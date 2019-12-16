import { StyleSheet } from '@byteclaw/visage-core';
import { ScaleValue } from '@byteclaw/visage-utils';
import React from 'react';

export interface ColorPalette {
  /** Body background color */
  body?: string | ScaleValue<string>;
  bodyText: string | ScaleValue<string>;
  dangerBodyText: string | ScaleValue<string>;
  /** Danger background color */
  danger: ScaleValue<string>;
  dangerText: string | ScaleValue<string>;
  /** Neutral background color */
  neutral: string | ScaleValue<string>;
  neutralText: string | ScaleValue<string>;
  /** Primary background color */
  primary: string | ScaleValue<string>;
  primaryText: string | ScaleValue<string>;
  /** Success background color */
  success: ScaleValue<string>;
  successText: string | ScaleValue<string>;
  /** Warning background color */
  warning: ScaleValue<string>;
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
