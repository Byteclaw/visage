import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import { createComponent } from '../core';
import { Heading } from './Heading';
import { LayerManager, useLayerManager } from './LayerManager';
import { Portal } from './Portal';

const ModalBase = createComponent('div', {
  displayName: 'ModalBase',
  defaultStyles: {
    alignItems: 'center',
    backgroundColor: 'hsla(0,0%,9%,.5)',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const ModalDialog = createComponent('div', {
  displayName: 'ModalDialog',
  defaultStyles: {
    backgroundColor: 'white',
    height: ['100%', null],
    maxHeight: ['100%', '75%', '50%'],
    p: 1,
    position: 'relative',
    width: ['100%', '75%', '50%'],
    transform: 'translateZ(0)',
  },
});

const ModalCloseButton = createComponent('button', {
  displayName: 'ModalCloseButton',
  defaultStyles: {
    backgroundColor: 'black',
    borderColor: 'transparent',
    borderWidth: 2,
    borderStyle: 'solid',
    cursor: 'pointer',
    position: 'absolute',
    outline: 'none',
    overflow: 'hidden',
    top: 0,
    right: 0,
    height: '3em',
    width: '3em',
    '&:focus': {
      borderColor: 'blue',
    },
  },
});

interface ModalProps {
  children?: ReactNode;
  /** Close button label (default close modal) */
  closeButtonLabel?: string;
  label: string | ReactElement;
  /**
   * Unique id of the modal
   */
  id: string;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  /**
   * Accessibility role, use alert dialog if you need user's interaction
   * Default is dialog (you don't need users immediate action)
   */
  role?: 'dialog' | 'alertdialog';
}

export function Modal({
  children,
  closeButtonLabel = 'close modal',
  label,
  id,
  onClose,
  role = 'dialog',
}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalBaseRef = useRef<HTMLDivElement>(null);
  const zIndex = useLayerManager();
  const headingId = `modal-${id}-heading`;
  const onDocumentFocus: EventListener = useCallback(e => {
    if (
      modalRef.current &&
      modalRef.current.contains(e.target as any) === false
    ) {
      e.preventDefault();

      // return focus back to close button
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }
  }, []);
  const onClickAwayHandler: MouseEventHandler = useCallback(
    e => {
      if (modalRef.current && modalRef.current.contains(e.target as any)) {
        return;
      }

      if (onClose) {
        onClose(e);
      }
    },
    [onClose],
  );
  const onClickHandler: MouseEventHandler = useCallback(
    e => {
      if (onClose) {
        e.preventDefault();
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

  // focus close button on mount
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  // focus trap
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('focus', onDocumentFocus, true);

      return () => {
        document.removeEventListener('focus', onDocumentFocus, true);
      };
    }
  }, []);

  if (typeof document === 'undefined') {
    return null;
  }

  return (
    <Portal containerId={`modal-portal-${id}`}>
      <LayerManager>
        <ModalBase
          ref={modalBaseRef}
          onClick={onClickAwayHandler}
          onKeyDown={onEscKeyDownHandler}
          id={id}
          styles={{ zIndex }}
          tabIndex={-1}
        >
          <ModalDialog
            aria-labelledby={headingId}
            aria-modal
            ref={modalRef}
            role={role}
          >
            <ModalCloseButton
              aria-label={closeButtonLabel}
              onClick={onClickHandler}
              ref={closeButtonRef}
              type="button"
            />
            <Heading id={headingId} level={3}>
              {label}
            </Heading>
            {children}
          </ModalDialog>
        </ModalBase>
      </LayerManager>
    </Portal>
  );
}
