import React from 'react';
import { DesignSystem, DesignSystemProps } from './DesignSystem';

export interface ResponsiveDesignSystemProps
  extends Omit<DesignSystemProps, 'responsive'> {}

export function ResponsiveDesignSystem({
  ...restProps
}: ResponsiveDesignSystemProps) {
  return <DesignSystem {...restProps} responsive />;
}
