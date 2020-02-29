import { render as baseRender } from '@testing-library/react';
import React from 'react';
import { TestDesignSystem } from './DesignSystem';

function Container({
  wrapper: Wrapper,
  children,
}: {
  wrapper?: React.ComponentType;
  children: React.ReactNode;
}) {
  return (
    <TestDesignSystem>
      {Wrapper ? <Wrapper>{children}</Wrapper> : children}
    </TestDesignSystem>
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
