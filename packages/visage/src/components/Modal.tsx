import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useRef,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock';
import { createComponent } from '../core';
import { booleanVariant, booleanVariantStyles } from '../variants';
import { LayerManager, useLayerManager } from './LayerManager';
import { Portal } from './Portal';

const BaseModal = createComponent('div', {
  displayName: 'Modal',
  defaultStyles: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    ...booleanVariantStyles('fixed', {
      on: {
        position: 'fixed',
      },
    }),
    ...booleanVariantStyles('backdrop', {
      on: {
        backgroundColor: 'hsla(0,0%,9%,.5)',
      },
    }),
  },
  variants: [booleanVariant('fixed', true), booleanVariant('backdrop', true)],
});

interface ModalProps {
  allowScrolling?: boolean;
  backdrop?: boolean;
  fixed?: boolean;
  children?: ReactNode;
  /** Close button label (default close modal) */
  /**
   * Unique id of the modal
   */
  id: string;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  /**
   * Accessibility role, use alert dialog if you need user's interaction
   * Default is dialog (you don't need users immediate action)
   */
  open: boolean;
}

export function Modal({
  allowScrolling = false,
  backdrop = true,
  fixed = true,
  children,
  id,
  onClose,
  open = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const zIndex = useLayerManager();
  const onClickAwayHandler: MouseEventHandler = useCallback(
    e => {
      if (e.target === modalRef.current && onClose) {
        onClose(e);
      }
    },
    [onClose],
  );

  const onEscKeyDownHandler: KeyboardEventHandler = useCallback(
    e => {
      if (e.key === 'Escape' && onClose) {
        onClose(e);
      }
    },
    [onClose],
  );

  React.useEffect(() => {
    if (modalRef.current != null) {
      if (!allowScrolling && open) {
        disableBodyScroll(modalRef.current as HTMLElement);
      } else {
        enableBodyScroll(modalRef.current as HTMLElement);
      }
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [allowScrolling, open, modalRef.current]);

  if (typeof document === 'undefined' || !open) {
    return null;
  }

  return (
    <Portal containerId={`modal-portal-${id}`}>
      <LayerManager>
        <BaseModal
          backdrop={backdrop}
          fixed={fixed}
          onClick={onClickAwayHandler}
          onKeyDown={onEscKeyDownHandler}
          ref={modalRef}
          styles={{ zIndex }}
        >
          {children}
        </BaseModal>
      </LayerManager>
    </Portal>
  );
}
