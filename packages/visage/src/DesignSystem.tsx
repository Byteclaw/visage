import {
  DesignSystem as BaseDesignSystem,
  ThemeCreator,
} from '@byteclaw/visage-core';
import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import { createEmotionStyleSheetHook } from './createEmotionStyleSheetHook';
import { GlobalReset } from './GlobalReset';

export interface DesignSystemProps {
  children?: ReactNode;
  /** Default breakpoint */
  is?: number;
  theme: ThemeCreator;
}

const DesignSystem: FunctionComponent<DesignSystemProps> = ({
  is = 0,
  theme,
  children,
}) => (
  <BaseDesignSystem
    is={is}
    styleSheet={createEmotionStyleSheetHook}
    theme={theme}
  >
    <Fragment>
      <GlobalReset />
      {children}
    </Fragment>
  </BaseDesignSystem>
);

export { DesignSystem };
