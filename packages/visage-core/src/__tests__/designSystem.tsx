import { RenderOptions, render as baseRender } from '@testing-library/react';
import React, { CSSProperties, ReactNode } from 'react';
import {
  createComponent as baseCreateComponent,
  createTheme,
  ComponentFactory,
  DesignSystem as BaseDesignSystem,
} from '..';
import { resolveStyleSheets } from '../styleSheet';
import { StyleGenerator, Theme } from '../types';

export interface StylingProps {
  styles?: CSSProperties;
}

export const createComponent: ComponentFactory<CSSProperties> = baseCreateComponent;

const theme = createTheme({
  theme: {} as any,
});

const generateStyle: StyleGenerator = (styleSheets, ctx) => {
  return {
    style: resolveStyleSheets(styleSheets, ctx),
  };
};

export function DesignSystem({
  is = 0,
  children,
  theme: themeOverride = theme,
}: {
  is?: number;
  children: ReactNode;
  theme?: Theme;
}) {
  return (
    <BaseDesignSystem
      is={is}
      styleGenerator={generateStyle}
      theme={themeOverride}
    >
      {children}
    </BaseDesignSystem>
  );
}

function Container({
  wrapper: Wrapper,
  children,
}: {
  wrapper?: React.ComponentType;
  children: React.ReactNode;
}) {
  return (
    <DesignSystem>
      {Wrapper ? <Wrapper>{children}</Wrapper> : children}
    </DesignSystem>
  );
}

export function render(
  ui: React.ReactElement,
  { wrapper, ...restConfig }: Omit<RenderOptions, 'queries'> = {
    wrapper: undefined,
  },
) {
  return baseRender(ui, {
    ...restConfig,
    wrapper: ({ children }) => (
      <Container wrapper={wrapper}>{children}</Container>
    ),
  });
}
