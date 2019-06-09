import React from 'react';
import { VisageContext } from './context';
import { useDesignSystem } from './hooks';
import { Theme, StyleGenerator } from './types';

interface DesignSystemProps<TTheme extends Theme> {
  children?: React.ReactNode;
  is?: number;
  styleGenerator: StyleGenerator;
  theme: TTheme;
}

export function DesignSystem<TTheme extends Theme>({
  is = 0,
  children,
  styleGenerator,
  theme,
}: DesignSystemProps<TTheme>) {
  const visage = useDesignSystem({ is, styleGenerator, theme });

  return (
    <VisageContext.Provider value={visage}>{children}</VisageContext.Provider>
  );
}
