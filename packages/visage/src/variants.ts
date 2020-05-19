import { OmitPropsSetting } from '@byteclaw/visage-utils';

/**
 * Creates boolean variant settings for component
 */
export function booleanVariant<TName extends string>(
  name: TName,
  /** Strip the prop from HTML element? */
  stripProp: boolean,
  /** Default value, if undefined, false will be used */
  defaultValue: boolean | null | undefined = false,
): {
  [K in TName]?: boolean | null;
} {
  return ({
    prop: name,
    name: name.toLowerCase(),
    stripProp,
    defaultValue,
  } as OmitPropsSetting) as any;
}

/**
 * Creates a number prop for component
 */
export function numberProp<TName extends string>(
  name: TName,
  /** Strip the prop from HTML element? */
  stripProp: boolean,
  defaultValue?: number,
): {
  [K in TName]?: number;
} {
  return ({
    prop: name,
    name: name.toLowerCase(),
    stripProp,
    defaultValue,
  } as OmitPropsSetting) as any;
}

/**
 * Creates variant settings for component
 */
export function variant<TName extends string, TVariants extends readonly any[]>(
  name: TName,
  /** Strip the prop from HTML element? */
  stripProp: boolean,
  // eslint-disable-next-line
  variants: TVariants,
  /**
   * Default value, if omitted "default" is used
   */
  defaultValue: keyof TVariants | 'default' = 'default',
): {
  [K in TName]?:
    | 'default'
    | (TVariants extends readonly any[]
        ? TVariants[Exclude<keyof TVariants, keyof Array<any>>]
        : string);
} {
  return ({
    prop: name,
    name: name.toLowerCase(),
    stripProp,
    defaultValue,
  } as OmitPropsSetting) as any;
}

/**
 * Creats boolean variant styles for face/component styles
 */
export function booleanVariantStyles(
  name: string,
  styles: {
    on?: VisageStyleSheet | undefined;
    off?: VisageStyleSheet | undefined;
  },
): { [key: string]: VisageStyleSheet | undefined } {
  const attrName = name.toLowerCase();
  const styleSheet: { [key: string]: VisageStyleSheet } = {};

  if (styles.on) {
    styleSheet[`&[data-${attrName}="true"]`] = styles.on;
  }

  if (styles.off) {
    styleSheet[`&[data-${attrName}="false"]`] = styles.off;
  }

  return styleSheet;
}

/**
 * Creats variants for face/component styles
 */
export function variantStyles(
  name: string,
  styles: {
    [key: string]: VisageStyleSheet | undefined;
    default?: VisageStyleSheet;
  },
): { [key: string]: VisageStyleSheet | undefined } {
  const attrName = name.toLowerCase();

  return Object.keys(styles).reduce(
    (styleSheet, key) => ({
      ...styleSheet,
      [`&[data-${attrName}="${key}"]`]: styles[key],
    }),
    {},
  );
}
