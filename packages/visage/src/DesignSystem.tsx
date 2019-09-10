import { DesignSystem as BaseDesignSystem, Theme } from '@byteclaw/visage-core';
import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import { styleGenerator } from './emotionStyleGenerator';
import { GlobalReset } from './GlobalReset';
import { LayerManager } from './components/LayerManager';
import { ToastManager } from './components/Toast';
import {
  EventEmitterContext,
  useEventEmitterInstance,
} from './hooks/useEventEmitter';
import { VisageFaces } from './faces';

export interface DesignSystemProps {
  children?: ReactNode;
  faces?: VisageFaces;
  /** Default breakpoint */
  is?: number;
  theme: Theme;
}

const DesignSystem: FunctionComponent<DesignSystemProps> = ({
  children,
  faces,
  is = 0,
  theme,
}) => {
  const toastEventEmitter = useEventEmitterInstance();

  return (
    <BaseDesignSystem
      is={is}
      faces={faces}
      styleGenerator={styleGenerator}
      theme={theme}
    >
      <LayerManager>
        <Fragment>
          <GlobalReset />
          <EventEmitterContext.Provider value={toastEventEmitter}>
            <ToastManager />
            {children}
          </EventEmitterContext.Provider>
        </Fragment>
      </LayerManager>
    </BaseDesignSystem>
  );
};

export { DesignSystem };
