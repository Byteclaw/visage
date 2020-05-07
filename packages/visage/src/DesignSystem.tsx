import {
  EventEmitterContext,
  useEventEmitterInstance,
} from '@byteclaw/use-event-emitter';
import { UniqueIdContextProvider } from '@byteclaw/use-unique-id';
import {
  DesignSystem as BaseDesignSystem,
  Theme,
  StyleGenerator,
  useBreakpointManager,
} from '@byteclaw/visage-core';
import React, { FunctionComponent, ReactNode, useState } from 'react';
import { CloseListenerManager } from './components';
import { globalComponentStyles, GlobalReset } from './GlobalReset';
import { GlobalStyles } from './GlobalStyles';
import { LayerManager } from './components/LayerManager';
import { ToastManager } from './components/Toast';
import { useBreakpointDetection } from './hooks';
import {
  defaultBreakpoints,
  defaultStyleGenerator,
  defaultTheme,
} from './defaults';

export interface DesignSystemProps {
  /**
   * Css media query conditions ordered from smallest to largest
   * e.g. ['only screen', 'screen and (min-width: 1024px)']
   *
   * This prop is respected only if responsive prop is set to true
   */
  breakpoints?: string[];
  children?: ReactNode;
  /**
   * Sets the default zIndex (default is 100)
   */
  defaultZIndex?: number;
  /**
   * Disables all styles that sets some visual properties and keeps just CSS reset for body and html
   */
  disableGlobalStyles?: boolean;
  /** Default breakpoint */
  is?: number;
  /**
   * Enable breakpoint detection using window.matchMedia API
   */
  responsive?: boolean;
  /**
   * Use custom style generator
   */
  styleGenerator?: StyleGenerator;
  /**
   * Use custom theme
   */
  theme?: Theme;
}

export const DesignSystem: FunctionComponent<DesignSystemProps> = ({
  breakpoints = defaultBreakpoints,
  children,
  defaultZIndex = 100,
  disableGlobalStyles,
  is = 0,
  responsive = false,
  styleGenerator = defaultStyleGenerator,
  theme = defaultTheme,
}) => {
  const [idContextValue] = useState(0);
  const toastEventEmitter = useEventEmitterInstance();
  const [breakpoint, setBreakpoint] = useBreakpointManager(is, breakpoints);
  useBreakpointDetection(responsive, breakpoints, setBreakpoint);

  return (
    <BaseDesignSystem
      is={breakpoint}
      styleGenerator={styleGenerator}
      theme={theme}
    >
      <CloseListenerManager>
        <UniqueIdContextProvider id={idContextValue}>
          <LayerManager increaseBy={defaultZIndex}>
            <GlobalReset />
            {disableGlobalStyles ? null : (
              <GlobalStyles styles={globalComponentStyles} />
            )}
            <EventEmitterContext.Provider value={toastEventEmitter}>
              <ToastManager />
              {children}
            </EventEmitterContext.Provider>
          </LayerManager>
        </UniqueIdContextProvider>
      </CloseListenerManager>
    </BaseDesignSystem>
  );
};
