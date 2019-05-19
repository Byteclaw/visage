import React, { CSSProperties, ReactNode } from 'react';
import {
  createComponent as baseCreateComponent,
  ComponentFactory,
  DesignSystem as BaseDesignSystem,
  createStylePropStyleSheetHook,
} from '..';
import { createTheme } from './theme';

export interface StylingProps {
  styles?: CSSProperties;
}

export const createComponent: ComponentFactory<
  StylingProps
> = baseCreateComponent;

export function DesignSystem({ children }: { children: ReactNode }) {
  return (
    <BaseDesignSystem
      is={0}
      styleSheet={createStylePropStyleSheetHook}
      theme={createTheme}
    >
      {children}
    </BaseDesignSystem>
  );
}
