/** Name of CSS properties that should use color resolver */
export const colorProps = [
  'backgroundColor',
  'borderColor',
  'borderBlockColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'borderBlockColor',
  'borderBlockEndColor',
  'borderBlockStartColor',
  'borderInlineColor',
  'borderInlineEndColor',
  'borderInlineStartColor',
  'color',
  'fill',
  'outlineColor',
  'stroke',
] as const;

/** Name of CSS properties that should use borderRadius theme value or their own theme value */
export const borderRadiusProps = [
  'borderRadius',
  'bordeTopLeftRadius',
  'bordeTopRightRadius',
  'bordeBottomLeftRadius',
  'bordeBottomRightRadius',
] as const;
