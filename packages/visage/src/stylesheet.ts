import { StyleSheet } from '@byteclaw/visage-core';

declare global {
  export interface VisageStylingProperties extends React.CSSProperties {
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

  export interface VisageStyleSheet extends StyleSheet {}
}
