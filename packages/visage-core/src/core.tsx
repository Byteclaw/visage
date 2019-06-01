import {
  createElement,
  forwardRef,
  ComponentClass,
  FunctionComponent,
} from 'react';
import { useDesignSystem } from './hooks';
import { ExtractProps, ValidComponent, VisageComponent, Theme } from './types';

const visageSymbol = '@@visage';

export function displayName(Component: ValidComponent): string {
  return (
    (Component as ComponentClass).displayName ||
    (Component as FunctionComponent).name ||
    (typeof Component === 'string' && Component.length > 0
      ? Component
      : 'Unknown')
  );
}

export function isVisageComponent(component: ValidComponent): boolean {
  if (typeof component === 'string') {
    return false;
  }

  return !!(component as any)[visageSymbol];
}

export function createComponent<
  TComponent extends ValidComponent,
  TStylingProps = {},
  TExtraStylers = {
    [key: string]: (
      theme: Theme,
      propValue: any,
      componentProps: any,
      styleProps: any,
    ) => any;
  }
>(
  As: TComponent,
  options: {
    defaultProps?: ExtractProps<TComponent> & TStylingProps;
    displayName?: string;
    extraStylers?: TExtraStylers;
  } = {},
): VisageComponent<
  ExtractProps<TComponent>,
  TStylingProps &
    Partial<
      {
        [K in keyof TStylingProps]: Partial<
          { [EK in keyof TExtraStylers]: any }
        >
      }
    >
> {
  const Component = forwardRef<any, { as: ValidComponent }>(
    ({ as, ...restProps }, ref) => {
      const { useStyleSheet } = useDesignSystem();
      const styleSheet = useStyleSheet(
        restProps,
        options.defaultProps,
        options.extraStylers as any,
      );

      if (isVisageComponent(as)) {
        return createElement(as, {
          ...restProps,
          parentStyleSheet: styleSheet,
          ref,
        });
      }

      return createElement(as, {
        // generate styles should take care of removing style props from component props
        // and populate them with style props for specific platform e.g. style, styles (react-native)
        ...styleSheet.generateStyles(),
        ref,
      });
    },
  );

  Component.defaultProps = {
    ...options.defaultProps,
    as: As,
  };

  Component.displayName = `VisageComponent<${options.displayName ||
    displayName(As)}>`;
  (Component as any)[visageSymbol] = true;

  return Component;
}
