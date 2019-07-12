import {
  DesignSystem as BaseDesignSystem,
  Theme,
  useBreakpointManager,
} from '@byteclaw/visage-core';
import React, { Fragment, ReactNode } from 'react';
import { useBreakpointDetection } from './hooks';
import { styleGenerator } from './emotionStyleGenerator';
import { GlobalReset } from './GlobalReset';
import { LayerManager } from './components/LayerManager';

const MOBILE_BP = `only screen`; // 40em
const TABLET_BP = `screen and (min-width: ${641 / 16}em)`; // 40.0625em
const DESKTOP_BP = `screen and (min-width: ${1025 / 16}em)`; // 64.036em

const defaultBreakpoints = [MOBILE_BP, TABLET_BP, DESKTOP_BP];

export interface ResponsiveDesignSystemProps {
  children?: ReactNode;
  /**
   * Css media query conditions orders from smallest to largest
   * e.g. ['only screen', 'screen and (min-width: 1024px)']
   */
  breakpoints?: string[];
  /** Default breakpoint */
  is?: number;
  theme: Theme;
}

export function ResponsiveDesignSystem({
  children,
  breakpoints = defaultBreakpoints,
  is = 0,
  theme,
}: ResponsiveDesignSystemProps) {
  const [breakpoint, setBreakpoint] = useBreakpointManager(is, breakpoints);
  useBreakpointDetection(breakpoints, setBreakpoint);

  return (
    <BaseDesignSystem
      is={breakpoint}
      styleGenerator={styleGenerator}
      theme={theme}
    >
      <LayerManager>
        <Fragment>
          <GlobalReset />
          {children}
        </Fragment>
      </LayerManager>
    </BaseDesignSystem>
  );
}
