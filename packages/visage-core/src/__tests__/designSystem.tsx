import React, { CSSProperties, ReactNode } from 'react';
import {
  createComponent as baseCreateComponent,
  createTheme,
  ComponentFactory,
  DesignSystem as BaseDesignSystem,
} from '..';

export interface StylingProps {
  styles?: CSSProperties;
}

export const createComponent: ComponentFactory<
  StylingProps
> = baseCreateComponent;

const theme = createTheme({});

function generateStyle(styleSheet) {
  return { style: styleSheet };
}

export function DesignSystem({ children }: { children: ReactNode }) {
  return (
    <BaseDesignSystem is={0} styleGenerator={generateStyle} theme={theme}>
      {children}
    </BaseDesignSystem>
  );
}
