import { useUniqueId } from '@byteclaw/use-unique-id';
import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import React, {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { createComponent } from '../core';
import { booleanVariant, variant } from '../variants';
import { LayerManager, useLayerManager } from './LayerManager';
import { Portal } from './Portal';

const Backdrop = createComponent('div', {
  displayName: 'DrawerBackdrop',
  styles: {
    backgroundColor: 'hsla(0,0%,9%,.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
  },
});

export enum DrawerPosition {
  bottom = 'bottom',
  left = 'left',
  right = 'right',
  top = 'top',
}

const BaseDrawer = createComponent('div', {
  displayName: 'Drawer',
  styles: props => ({
    backgroundColor: 'lightShades',
    overflowY: 'scroll',
    ...(props.relative
      ? { position: 'relative' }
      : {
          position: 'fixed',
          boxShadow:
            '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
          ...(props.side
            ? {
                ...(props.side === 'bottom'
                  ? {
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: ['90vh', '75vh', '50vh'],
                      ...(!props.open ? { transform: 'translateY(100%)' } : {}),
                    }
                  : {}),
                ...(props.side === 'left'
                  ? {
                      bottom: 0,
                      left: 0,
                      top: 0,
                      width: ['90vw', '75vw', '50vw'],
                      ...(!props.open
                        ? { transform: 'translateX(-100%)' }
                        : {}),
                    }
                  : {}),
                ...(props.side === 'right'
                  ? {
                      bottom: 0,
                      right: 0,
                      top: 0,
                      width: ['90vw', '75vw', '50vw'],
                      ...(!props.open ? { transform: 'translateX(100%)' } : {}),
                    }
                  : {}),
                ...(props.side === 'top'
                  ? {
                      top: 0,
                      left: 0,
                      right: 0,
                      height: ['90vh', '75vh', '50vh'],
                      ...(!props.open
                        ? { transform: 'translateY(-100%)' }
                        : {}),
                    }
                  : {}),
              }
            : {}),
        }),
  }),
  variants: [
    variant('side', true, ['bottom', 'left', 'right', 'top']),
    booleanVariant('open', true),
    booleanVariant('relative', true),
  ],
});

interface DrawerProps {
  /** Enables to completely disable backdrop even if Drawer is closable, default is true */
  backdrop?: boolean;
  children?: ReactNode;
  inPortal?: boolean;
  onClose?: (e?: KeyboardEvent | MouseEvent) => void;
  open?: boolean;
  /**
   * Use relative position instead of fixed
   */
  relative?: boolean;
  side?: DrawerPosition;
  styles?: ExtractVisageComponentProps<typeof BaseDrawer>['styles'];
}

export function Drawer({
  backdrop = true,
  children,
  inPortal = false,
  onClose,
  open = false,
  relative = false,
  side = DrawerPosition.left,
  styles,
}: DrawerProps) {
  const id = useUniqueId();
  const { zIndex } = useLayerManager();
  const onEscKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (open && onClose && e.keyCode === 27) {
        onClose(e);
      }
    },
    [onClose, open],
  );

  useEffect(() => {
    if (onClose != null && typeof document !== 'undefined') {
      document.addEventListener('keyup', onEscKeyUp as any);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keyup', onEscKeyUp as any);
      }
    };
  }, [onEscKeyUp]);

  if (relative) {
    return (
      <BaseDrawer relative={relative} styles={styles}>
        {children}
      </BaseDrawer>
    );
  }

  const drawer = (
    <LayerManager>
      {onClose && backdrop ? (
        <Backdrop onClick={onClose} styles={{ zIndex }} />
      ) : null}
      <BaseDrawer open={open} side={side} styles={{ zIndex, ...styles }}>
        {children}
      </BaseDrawer>
    </LayerManager>
  );

  if (inPortal) {
    if (typeof document === 'undefined' || !open) {
      return null;
    }

    return <Portal containerId={`drawer-root-${id}`}>{drawer}</Portal>;
  }

  return open ? drawer : null;
}
