import { VisageComponentSymbol } from './constants';
import { VisageComponent } from './types';

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
    | VisageComponent<any>
>(component: T): T {
  // eslint-disable-next-line no-param-reassign
  (component as any)[VisageComponentSymbol] = true;

  return component;
}

/**
 * Detects if component is a Visage component
 */
export function isVisageComponent(
  component:
    | React.ComponentClass
    | React.FunctionComponent
    | VisageComponent<any>
    | string,
): component is VisageComponent<any> {
  if (typeof component === 'string') {
    return false;
  }

  return !!(component as any)[VisageComponentSymbol];
}
