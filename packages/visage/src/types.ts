import { StyleSheet } from '@byteclaw/visage-core';
import { ScaleValue } from '@byteclaw/visage-utils';

export interface ColorPalette {
  /** Accent color to bring attention to design elements */
  lightAccent: string | ScaleValue<string>;
  lightAccentText: string | ScaleValue<string>;
  /** Used as background color for dark on light design or text color of inverted design */
  lightShades: string | ScaleValue<string>;
  lightShadesText: string | ScaleValue<string>;
  lightShadeOverlay: string | ScaleValue<string>;
  lightShadeOverlayText: string | ScaleValue<string>;
  primary: string | ScaleValue<string>;
  primaryText: string | ScaleValue<string>;
  /** Alternative accent color */
  darkAccent: string | ScaleValue<string>;
  darkAccentText: string | ScaleValue<string>;
  /** Used as text color for dark on light design or background color of inverted design */
  darkShades: string | ScaleValue<string>;
  darkShadesText: string | ScaleValue<string>;
  darkShadeOverlay: string | ScaleValue<string>;
  darkShadeOverlayText: string | ScaleValue<string>;
  /** Uses as background for danger elements or as invalid color */
  danger: string | ScaleValue<string>;
  dangerText: string | ScaleValue<string>;
  /** Uses as background for info elements or as info text color */
  info: string | ScaleValue<string>;
  infoText: string | ScaleValue<string>;
  neutral: string | ScaleValue<string>;
  neutralText: string | ScaleValue<string>;
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

export interface FontPalette {
  body: string;
  heading: string;
  [extra: string]: undefined | string;
}

export type EmotionStyleSheet = StyleSheet<VisageStylingProperties>;
