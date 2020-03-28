import {
  EventEmitterContext,
  useEventEmitterInstance,
} from '@byteclaw/use-event-emitter';
import { UniqueIdContextProvider } from '@byteclaw/use-unique-id';
import {
  DesignSystem as BaseDesignSystem,
  Theme,
  useBreakpointManager,
  StyleGenerator,
} from '@byteclaw/visage-core';
import React, { ReactNode, useState } from 'react';
import { CloseListenerManager } from './CloseListenerManager';
import { useBreakpointDetection } from './hooks';
import { globalComponentStyles, GlobalReset } from './GlobalReset';
import { GlobalStyles } from './GlobalStyles';
import { LayerManager } from './components/LayerManager';
import { ToastManager } from './components/Toast';
import { createEmotionStyleGenerator } from './emotionStyleGenerator';

const defaultStyleGenerator = createEmotionStyleGenerator();

// https://zellwk.com/blog/media-query-units/
const MOBILE_BP = `(max-width: ${767 / 16}em)`;
const TABLET_BP = `(min-width: ${768 / 16}em) and (max-width: ${1024 / 16}em)`;
const DESKTOP_BP = `(min-width: ${1025 / 16}em)`;

const defaultBreakpoints = [MOBILE_BP, TABLET_BP, DESKTOP_BP];

export interface ResponsiveDesignSystemProps {
  /**
   * Css media query conditions orders from smallest to largest
   * e.g. ['only screen', 'screen and (min-width: 1024px)']
   */
  breakpoints?: string[];
  children?: ReactNode;
  /**
   * Sets the default zIndex (default is 1)
   */
  defaultZIndex?: number;
  /**
   * Disables all styles that sets some visual properties and keeps just CSS reset for body and html
   */
  disableGlobalStyles?: boolean;
  /** Default breakpoint */
  is?: number;
  styleGenerator?: StyleGenerator;
  theme: Theme;
}

export function ResponsiveDesignSystem({
  breakpoints = defaultBreakpoints,
  children,
  defaultZIndex = 100,
  disableGlobalStyles,
  is = 0,
  styleGenerator = defaultStyleGenerator,
  theme,
}: ResponsiveDesignSystemProps) {
  const [idContextValue] = useState(0);
  const toastEventEmitter = useEventEmitterInstance();
  const [breakpoint, setBreakpoint] = useBreakpointManager(is, breakpoints);
  useBreakpointDetection(breakpoints, setBreakpoint);

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
}
