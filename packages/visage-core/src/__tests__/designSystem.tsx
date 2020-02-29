import { render as baseRender } from '@testing-library/react';
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

export const createComponent: ComponentFactory<CSSProperties> = baseCreateComponent;

const theme = createTheme({});

function generateStyle(styleSheet) {
  return { style: styleSheet };
}

export function DesignSystem({
  is = 0,
  children,
}: {
  is?: number;
  children: ReactNode;
}) {
  return (
    <BaseDesignSystem is={is} styleGenerator={generateStyle} theme={theme}>
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

export const render: typeof baseRender = (
  ui,
  { wrapper, ...restConfig } = { wrapper: undefined },
) => {
  return baseRender(ui, {
    ...restConfig,
    wrapper: ({ children }) => (
      <Container wrapper={wrapper}>{children}</Container>
    ),
  });
};
