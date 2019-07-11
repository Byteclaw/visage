import React from 'react';
import { createComponent } from '../core';
import { Portal } from './Portal';

const OverlayDiv = createComponent('div', {
  displayName: 'OverlayDiv',
  defaultStyles: {
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
  containerId: string;
}

export function Overlay({ containerId, ...rest }: OverlayProps) {
  return (
    <Portal containerId={containerId}>
      <OverlayDiv {...rest} />
    </Portal>
  );
}
