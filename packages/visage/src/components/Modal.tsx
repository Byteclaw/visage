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
import { CloseIcon } from '../assets';
import { LayerManager, useLayerManager } from './LayerManager';
import { Portal } from './Portal';
import { SvgIcon } from './SvgIcon';
import { Backdrop } from './Backdrop';
import { StyleProps } from '../createNPointTheme';

const BaseModal = createComponent('div', {
  displayName: 'BaseModal',
  defaultStyles: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

interface ModalProps {
  allowScrolling?: boolean;
  backdrop?: boolean;
  backdropStyles?: StyleProps;
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
  backdropStyles,
  children,
  id,
  onClose,
  open = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const zIndex = useLayerManager();

  const onClickAwayHandler: MouseEventHandler = useCallback(
    e => {
      if (onClose) {
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
        <LayerManager>
          <BaseModal tabIndex={-1} onKeyDown={onEscKeyDownHandler} ref={modalRef} open={open}>
            {backdrop ? (
              <Backdrop
                aria-hidden="true"
                styles={{
                  zIndex: zIndex - 1,
                  backgroundColor: 'hsla(0,0%,9%,.5)',
                  ...backdropStyles,
                }}
                open={open}
                onClick={onClickAwayHandler}
              />
            ) : null}
            {children}
          </BaseModal>
        </LayerManager>
      </LayerManager>
    </Portal>
  );
}
