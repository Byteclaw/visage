import { render as baseRender, RenderOptions } from '@testing-library/react';
import React from 'react';
import {
  createTestTheme,
  TestDesignSystem,
} from '../../__tests__/TestDesignSystem';

export { createTestTheme };

interface ContainerProps {
  children?: React.ReactNode;
  ds?: React.ComponentProps<typeof TestDesignSystem>;
  wrapper?: React.ComponentType;
}

function Container({ wrapper: Wrapper, ds, children }: ContainerProps) {
  return (
    <TestDesignSystem {...ds}>
      {Wrapper ? <Wrapper>{children}</Wrapper> : children}
    </TestDesignSystem>
  );
}

export function render(
  ui: React.ReactElement,
  { ds, wrapper, ...restConfig }: RenderOptions & ContainerProps = {},
) {
  return baseRender(ui, {
    ...restConfig,
    wrapper: ({ children }) => (
      <Container wrapper={wrapper} ds={ds}>
        {children}
      </Container>
    ),
  });
}
