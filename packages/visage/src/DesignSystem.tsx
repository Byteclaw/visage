import { DesignSystem as BaseDesignSystem, Theme } from '@byteclaw/visage-core';
import React, { Fragment, FunctionComponent, ReactNode, useState } from 'react';
import { styleGenerator } from './emotionStyleGenerator';
import { GlobalReset } from './GlobalReset';
import { LayerManager } from './components/LayerManager';
import { ToastManager } from './components/Toast';
import {
  EventEmitterContext,
  useEventEmitterInstance,
} from './hooks/useEventEmitter';
import { IdContext } from './hooks/useGenerateId';
import { VisageFaces } from './faces';

export interface DesignSystemProps {
  children?: ReactNode;
  /**
   * Sets the default zIndex (default is 1)
   */
  defaultZIndex?: number;
  faces?: VisageFaces;
  /** Default breakpoint */
  is?: number;
  theme: Theme;
}

const DesignSystem: FunctionComponent<DesignSystemProps> = ({
  defaultZIndex = 1,
  children,
  faces,
  is = 0,
  theme,
}) => {
  const [idContextValue] = useState({ id: 0 });
  const toastEventEmitter = useEventEmitterInstance();

  return (
    <BaseDesignSystem
      is={is}
      faces={faces}
      styleGenerator={styleGenerator}
      theme={theme}
    >
      <IdContext.Provider value={idContextValue}>
        <LayerManager increaseBy={defaultZIndex}>
          <Fragment>
            <GlobalReset />
            <EventEmitterContext.Provider value={toastEventEmitter}>
              <ToastManager />
              {children}
            </EventEmitterContext.Provider>
          </Fragment>
        </LayerManager>
      </IdContext.Provider>
    </BaseDesignSystem>
  );
};

export { DesignSystem };
