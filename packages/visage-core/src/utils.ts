import { VisageComponentSymbol } from './constants';
import { ResolvedStyleSheet, VisageComponent } from './types';
import { Theme } from './theme';

/**
 * Returns a display name of a component
 */
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

/**
 * Marks a component as Visage component
 */
export function markAsVisageComponent<
  T extends
    | React.ComponentClass
    | React.FunctionComponent
    | VisageComponent<any, any>
>(component: T): T {
  // eslint-disable-next-line no-param-reassign
  (component as any)[VisageComponentSymbol] = true;

  return component;
}

/**
 * Detects if component is a Visage component
 */
export function isVisageComponent(
  component: React.ComponentClass | React.FunctionComponent | string,
): boolean {
  if (typeof component === 'string') {
    return false;
  }

  return !!(component as any)[VisageComponentSymbol];
}

/**
 * Resolves raw stylesheet using current responsive breakpoint and theme
 *
 * This means that for example display: ['block', 'none'] is resolved to block if breakpoint is 0
 *
 * Works for nested style sheets too
 */
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
