import { VisageComponentSymbol } from './constants';
import { ResolvedStyleSheet, Theme, ValidStyleSheet } from './types';

export function displayName(
  Component: React.ComponentClass | React.FunctionComponent | string,
): string {
  return (
    (Component as React.ComponentClass).displayName ||
    (Component as React.FunctionComponent).name ||
    (typeof Component === 'string' && Component.length > 0
      ? Component
      : 'Unknown')
  );
}

export function isVisageComponent(
  component: React.ComponentClass | React.FunctionComponent | string,
): boolean {
  if (typeof component === 'string') {
    return false;
  }

  return !!(component as any)[VisageComponentSymbol];
}

export function extendStyleSheet<TStyleSheet extends ValidStyleSheet>(
  styles?: TStyleSheet,
  parentStyles?: TStyleSheet,
): TStyleSheet {
  if (!(styles && parentStyles)) {
    return styles || parentStyles || ({} as TStyleSheet);
  }

  const styleSheet: TStyleSheet = Object.assign({}, styles);

  // merge parent styles to styleSheet
  // we need to use parent styles to override local styles
  // because <Button as={Link} /> should be a Button with Link behaviour
  const keys = Object.keys(parentStyles);
  const keysLength = keys.length;

  for (let i = 0; i < keysLength; i++) {
    const key: keyof TStyleSheet = keys[i];
    const value = parentStyles[key];
    const valueType = typeof value;

    if (valueType === 'object' && value !== null && !Array.isArray(value)) {
      // this is pseudo
      if (!styleSheet[key]) {
        styleSheet[key] = value;
      } else {
        styleSheet[key] = {
          ...styleSheet[key],
          ...value,
        };
      }
    } else if (valueType !== 'undefined') {
      styleSheet[key] = value;
    }
  }

  return styleSheet;
}

export function resolveStyleSheet<
  TTheme extends Theme,
  TStyleSheet extends { [key: string]: any }
>(
  styleSheet: TStyleSheet,
  breakpoint: number,
  theme: TTheme,
): ResolvedStyleSheet {
  const keys = Object.keys(styleSheet);
  const keysLength = keys.length;
  const resolvedStyleSheet: ResolvedStyleSheet = {};

  for (let i = 0; i < keysLength; i++) {
    const key = keys[i];
    const value = styleSheet[key];
    const valueType = typeof value;

    if (valueType === 'object' && value !== null && !Array.isArray(value)) {
      // pseudo styleSheet
      resolvedStyleSheet[key] = resolveStyleSheet(value, breakpoint, theme) as {
        [key: string]: string | null | undefined | number;
      };
    } else {
      const { properties, value: output } = theme.resolve(
        key,
        value,
        breakpoint,
      );

      for (let p = 0; p < properties.length; p++) {
        resolvedStyleSheet[properties[p]] = output;
      }
    }
  }

  return resolvedStyleSheet;
}
