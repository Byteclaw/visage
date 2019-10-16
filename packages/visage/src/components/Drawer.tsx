import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import React, {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { createComponent } from '../core';
import { useGenerateId } from '../hooks/useGenerateId';
import {
  booleanVariant,
  booleanVariantStyles,
  variant,
  variantStyles,
} from '../variants';
import { LayerManager, useLayerManager } from './LayerManager';
import { Portal } from './Portal';

const Backdrop = createComponent('div', {
  displayName: 'Backdrop',
  defaultStyles: {
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
  defaultStyles: {
    background: 'white',
    ...booleanVariantStyles('relative', {
      on: {
        position: 'relative',
      },
      off: {
        position: 'fixed',
        ...variantStyles('side', {
          bottom: {
            ...booleanVariantStyles('open', {
              off: {
                transform: 'translateY(100%)',
              },
            }),
            bottom: 0,
            left: 0,
            right: 0,
            height: ['90vh', '75vh', '50vh'],
          },
          left: {
            ...booleanVariantStyles('open', {
              off: {
                transform: 'translateX(-100%)',
              },
            }),
            bottom: 0,
            left: 0,
            top: 0,
            width: ['90vw', '75vw', '50vw'],
          },
          right: {
            ...booleanVariantStyles('open', {
              off: {
                transform: 'translateX(100%)',
              },
            }),
            bottom: 0,
            right: 0,
            top: 0,
            width: ['90vw', '75vw', '50vw'],
          },
          top: {
            ...booleanVariantStyles('open', {
              off: {
                transform: 'translateY(-00%)',
              },
            }),
            top: 0,
            left: 0,
            right: 0,
            height: ['90vh', '75vh', '50vh'],
          },
        }),
      },
    }),
  },
  variants: [
    variant('side', true, ['bottom', 'left', 'right', 'top'], 'left' as any),
    booleanVariant('open', true),
    booleanVariant('relative', true),
  ],
});

export function Drawer({
  children,
  inPortal = false,
  onClose = () => {},
  open = false,
  relative = false,
  side,
  styles,
}: {
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
}) {
  const id = useGenerateId();
  const zIndex = useLayerManager();
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
      <Backdrop onClick={onClose} styles={{ zIndex }} />
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
