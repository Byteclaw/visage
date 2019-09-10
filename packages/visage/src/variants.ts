import { EmotionStyleSheet } from './types';

/**
 * Creates boolean variant settings for component
 */
export function booleanVariant<TName extends string>(
  name: TName,
  stripProp: boolean,
): {
  [K in TName]?: boolean;
} {
  return {
    name,
    stripProp,
    defaultValue: false,
  } as any;
}

/**
 * Creates variant settings for component
 */
export function variant<TName extends string, TVariants extends readonly any[]>(
  name: TName,
  stripProp: boolean,
  // eslint-disable-next-line
  variants: TVariants,
): {
  [K in TName]?:
    | 'default'
    | (TVariants extends readonly any[]
        ? TVariants[Exclude<keyof TVariants, keyof Array<any>>]
        : string);
} {
  return {
    name,
    stripProp,
    defaultValue: 'default',
  } as any;
}

/**
 * Creats boolean variant styles for face/component styles
 */
export function booleanVariantStyles(
  name: string,
  styles: {
    on?: EmotionStyleSheet | undefined;
    off?: EmotionStyleSheet | undefined;
  },
): { [key: string]: EmotionStyleSheet | undefined } {
  const styleSheet: { [key: string]: EmotionStyleSheet } = {};

  if (styles.on) {
    styleSheet[`&[data-${name}="true"]`] = styles.on;
  }

  if (styles.off) {
    styleSheet[`&[data-${name}="false"]`] = styles.off;
  }

  return styleSheet;
}

/**
 * Creats variants for face/component styles
 */
export function variantStyles(
  name: string,
  styles: {
    [key: string]: EmotionStyleSheet | undefined;
    default?: EmotionStyleSheet;
  },
): { [key: string]: EmotionStyleSheet | undefined } {
  return Object.keys(styles).reduce(
    (styleSheet, key) => ({
      ...styleSheet,
      [`&[data-${name}="${key}"]`]: styles[key],
    }),
    {},
  );
}
