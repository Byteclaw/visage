import { ComponentType } from 'react';
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

export function markAsVisageComponent<T extends ComponentType<any>>(
  component: React.MemoExoticComponent<T>,
): VisageComponent<T extends ComponentType<infer P> ? P : any>;
export function markAsVisageComponent<T>(
  component: React.ForwardRefExoticComponent<T>,
): VisageComponent<T>;
export function markAsVisageComponent<T>(
  component: React.ComponentType<T>,
): VisageComponent<T>;

/**
 * Marks a component as Visage component
 */
export function markAsVisageComponent<T>(
  component: React.ForwardRefExoticComponent<T> | React.ComponentType<T>,
): VisageComponent<T> {
  // eslint-disable-next-line no-param-reassign
  (component as any)[VisageComponentSymbol] = true;

  return component as any;
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
