import { useUniqueId } from '@byteclaw/use-unique-id';
import React, { useMemo } from 'react';
import { createComponent } from '../core';
import { Portal } from './Portal';

const OverlayDiv = createComponent('div', {
  displayName: 'Overlay',
  styles: {
    background: 'rgba(0, 0, 0, 0.8)',
    height: '100vh',
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
    width: '100vw',
  },
});

interface OverlayProps {
  containerId?: string;
}

export function Overlay({ containerId, ...rest }: OverlayProps) {
  const idTemplate = useUniqueId();
  const id = useMemo(() => {
    return containerId || `overlay-container-${idTemplate}}`;
  }, [containerId, idTemplate]);
  return (
    <Portal containerId={id}>
      <OverlayDiv {...rest} />
    </Portal>
  );
}
