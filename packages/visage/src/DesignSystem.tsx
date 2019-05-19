import {
  DesignSystem as BaseDesignSystem,
  ThemeCreator,
} from '@byteclaw/visage-core';
import React, { FunctionComponent, ReactNode } from 'react';
import { createEmotionStyleSheetHook } from './createEmotionStyleSheetHook';

export interface DesignSystemProps {
  children?: ReactNode;
  /** Default breakpoint */
  is?: number;
  theme: ThemeCreator;
}

const DesignSystem: FunctionComponent<DesignSystemProps> = ({
  is = 0,
  theme,
  ...restProps
}) => (
  <BaseDesignSystem
    is={is}
    styleSheet={createEmotionStyleSheetHook}
    theme={theme}
    {...restProps}
  />
);

export { DesignSystem };
