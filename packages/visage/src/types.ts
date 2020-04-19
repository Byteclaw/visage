import { ScaleValue } from '@byteclaw/visage-utils';

export interface BorderRadiuses {
  /**
   * Border radius used by form inputs, buttons, etc
   */
  controlBorderRadius?: number | string | undefined | null;
  /**
   * Border radius used by KeyboardKey
   */
  keyboardBorderRadius?: number | string | undefined | null;
  [extra: string]: number | string | undefined | null;
}

export interface ColorPalette {
  /** Accent color to bring attention to design elements */
  accent: string | ScaleValue<string>;
  accentText: string | ScaleValue<string>;
  /** Used as background color for dark on light design or text color of inverted design */
  shades: string | ScaleValue<string>;
  shadesText: string | ScaleValue<string>;
  primary: string | ScaleValue<string>;
  primaryText: string | ScaleValue<string>;
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
