import {
  EventEmitterContext,
  useEventEmitterInstance,
} from '@byteclaw/use-event-emitter';
import { UniqueIdContextProvider } from '@byteclaw/use-unique-id';
import {
  DesignSystem as BaseDesignSystem,
  Theme,
  StyleGenerator,
} from '@byteclaw/visage-core';
import React, { FunctionComponent, ReactNode, useState } from 'react';
import { createEmotionStyleGenerator } from './emotionStyleGenerator';
import { globalComponentStyles, GlobalReset } from './GlobalReset';
import { GlobalStyles } from './GlobalStyles';
import { LayerManager } from './components/LayerManager';
import { ToastManager } from './components/Toast';
import { VisageFaces } from './faces';

const defaultStyleGenerator = createEmotionStyleGenerator();

export interface DesignSystemProps {
  children?: ReactNode;
  /**
   * Sets the default zIndex (default is 1)
   */
  defaultZIndex?: number;
  /**
   * Disables all styles that sets some visual properties and keeps just CSS reset for body and html
   */
  disableGlobalStyles?: boolean;
  faces?: VisageFaces;
  /** Default breakpoint */
  is?: number;
  styleGenerator?: StyleGenerator;
  theme: Theme;
}

const DesignSystem: FunctionComponent<DesignSystemProps> = ({
  children,
  defaultZIndex = 1,
  disableGlobalStyles,
  faces,
  is = 0,
  styleGenerator = defaultStyleGenerator,
  theme,
}) => {
  const [idContextValue] = useState(0);
  const toastEventEmitter = useEventEmitterInstance();

  return (
    <BaseDesignSystem
      is={is}
      faces={faces}
      styleGenerator={styleGenerator}
      theme={theme}
    >
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
    </BaseDesignSystem>
  );
};

export { DesignSystem };
