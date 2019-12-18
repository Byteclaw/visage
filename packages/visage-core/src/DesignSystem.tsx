import React from 'react';
import { VisageContext } from './context';
import { useDesignSystem } from './hooks';
import { Theme } from './theme';
import { StyleGenerator, StyleSheet } from './types';

interface DesignSystemProps<
  TTheme extends Theme,
  TFaces extends { [componentName: string]: StyleSheet<any> | undefined }
> {
  children?: React.ReactNode;
  faces?: TFaces;
  is?: number;
  styleGenerator: StyleGenerator;
  theme: TTheme;
}

export function DesignSystem<
  TTheme extends Theme,
  TFaces extends { [componentName: string]: StyleSheet<any> | undefined } = {
    [componentName: string]: StyleSheet<any> | undefined;
  }
>({
  children,
  faces,
  is = 0,
  styleGenerator,
  theme,
}: DesignSystemProps<TTheme, TFaces>) {
  const visage = useDesignSystem({ faces, is, styleGenerator, theme });

  return (
    <VisageContext.Provider value={visage}>{children}</VisageContext.Provider>
  );
}
