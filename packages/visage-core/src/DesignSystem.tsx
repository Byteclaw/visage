import React from 'react';
import { VisageContext } from './context';
import { StyleGenerator, Theme } from './types';
import { useDesignSystem } from './useDesignSystem';

interface DesignSystemProps<TTheme extends Theme<any>> {
  children?: React.ReactNode;
  is?: number;
  styleGenerator: StyleGenerator;
  theme: TTheme;
}

export function DesignSystem<TTheme extends Theme>({
  children,
  is = 0,
  styleGenerator,
  theme,
}: DesignSystemProps<TTheme>) {
  const visage = useDesignSystem({
    is,
    styleGenerator,
    theme,
  });

  return (
    <VisageContext.Provider value={visage}>{children}</VisageContext.Provider>
  );
}
