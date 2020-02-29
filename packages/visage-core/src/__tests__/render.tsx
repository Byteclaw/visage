import { render as baseRender } from '@testing-library/react';
import React from 'react';
import { DesignSystem } from './designSystem';

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
