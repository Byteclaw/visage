import { StyleSheet } from '@byteclaw/visage-core';

declare global {
  export interface VisageStylingProperties
    extends Omit<React.CSSProperties, 'fontWeight'> {
    /**
     * Post style sheet that overrides current style sheet
     */
    face?: string;
    /**
     * Pre style sheet that is being extended by the current style sheet
     */
    extends?: string;
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
    fontWeight?: React.CSSProperties['fontWeight'] | string;
    /**
     * Shorthand for margin
     */
    m?: string | number;
    /**
     * Shorthand for margin-top, margin-bottom
     */
    my?: string | number;
    /**
     * Shorthand for margin-left, margin-right
     */
    mx?: string | number;
    /**
     * Shorthand for margin-bottom
     */
    mb?: string | number;
    /**
     * Shorthand for margin-left
     */
    ml?: string | number;
    /**
     * Shorthand for margin-right
     */
    mr?: string | number;
    /**
     * Shorthand for margin-top
     */
    mt?: string | number;
    /**
     * Shorthand for padding
     */
    p?: string | number;
    /**
     * Shorthand for padding-top, padding-bottom
     */
    py?: string | number;
    /**
     * Shorthand for padding-left, padding-right
     */
    px?: string | number;
    /**
     * Shorthand for padding-bottom
     */
    pb?: string | number;
    /**
     * Shorthand for padding-left
     */
    pl?: string | number;
    /**
     * Shorthand for padding-right
     */
    pr?: string | number;
    /**
     * Shorthand for padding-top
     */
    pt?: string | number;
  }

  export interface VisageStyleSheet extends StyleSheet {}
}
