import React, { createContext, ReactNode, useContext, useRef } from 'react';

interface LayerManagerState {
  // current nesting level
  level: number;
  /** Increases current zIndex by this number if level increases */
  increaseBy: number;
  // current zIndex that should be used
  zIndex: number;
}

export const LayerManagerContext = createContext<LayerManagerState>({
  level: 0,
  increaseBy: 100,
  zIndex: 0,
});

LayerManagerContext.displayName = 'LayerManagerContext';

interface LayerManagerProps {
  children: ReactNode;
  /**
   * Increases current zIndex by N (default is 100)
   */
  increaseBy?: number;
}

/**
 * Uses current layer manager state for given LayerProvider
 */
export function useLayerManager() {
  return useContext(LayerManagerContext);
}

export function LayerManager({ children, increaseBy }: LayerManagerProps) {
  const ctx = useLayerManager();
  const valueRef = useRef<LayerManagerState | undefined>();

  // increase zIndex and level
  if (!valueRef.current) {
    valueRef.current = {
      increaseBy: increaseBy ?? ctx.increaseBy,
      zIndex: ctx.zIndex + (increaseBy ?? ctx.increaseBy),
      level: ctx.level + 1,
    };
  }

  return (
    <LayerManagerContext.Provider value={valueRef.current!}>
      {children}
    </LayerManagerContext.Provider>
  );
}
