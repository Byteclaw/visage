import React, { createContext, ReactNode, useContext } from 'react';

export const LayerManagerContext = createContext(0);

LayerManagerContext.displayName = 'LayerManagerContext';

interface LayerManagerProps {
  children: ReactNode;
  /**
   * Increases current zIndex by N (default is 1)
   */
  increaseBy?: number;
}

export function useLayerManager() {
  return useContext(LayerManagerContext);
}

export function LayerManager({ children, increaseBy = 1 }: LayerManagerProps) {
  const currentZIndex = useContext(LayerManagerContext);

  return (
    <LayerManagerContext.Provider value={currentZIndex + increaseBy}>
      {children}
    </LayerManagerContext.Provider>
  );
}
