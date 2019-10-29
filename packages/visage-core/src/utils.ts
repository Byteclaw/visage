import { VisageComponentSymbol } from './constants';
import { ResolvedStyleSheet, Theme, VisageComponent } from './types';

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

export function markAsVisageComponent<
  T extends
    | React.ComponentClass
    | React.FunctionComponent
    | VisageComponent<any, any>
>(component: T): T {
  // eslint-disable-next-line
  (component as any)[VisageComponentSymbol] = true;

  return component;
}

export function isVisageComponent(
  component: React.ComponentClass | React.FunctionComponent | string,
): boolean {
  if (typeof component === 'string') {
    return false;
  }

  return !!(component as any)[VisageComponentSymbol];
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
