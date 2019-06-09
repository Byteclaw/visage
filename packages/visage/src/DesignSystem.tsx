import { DesignSystem as BaseDesignSystem, Theme } from '@byteclaw/visage-core';
import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import { styleGenerator } from './emotionStyleGenerator';
import { GlobalReset } from './GlobalReset';

export interface DesignSystemProps {
  children?: ReactNode;
  /** Default breakpoint */
  is?: number;
  theme: Theme;
}

const DesignSystem: FunctionComponent<DesignSystemProps> = ({
  is = 0,
  theme,
  children,
}) => (
  <BaseDesignSystem is={is} styleGenerator={styleGenerator} theme={theme}>
    <Fragment>
      <GlobalReset />
      {children}
    </Fragment>
  </BaseDesignSystem>
);

export { DesignSystem };
