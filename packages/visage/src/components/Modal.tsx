import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useRef,
  MouseEvent,
  KeyboardEvent,
  MutableRefObject,
  useMemo,
} from 'react';
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock';
import { createComponent } from '../core';
import { useGenerateId } from '../hooks';
import { booleanVariant } from '../variants';
import { LayerManager, useLayerManager } from './LayerManager';
import { Portal } from './Portal';

const Backdrop = createComponent('div', {
  displayName: 'Backdrop',
  defaultStyles: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    zIndex: 0,
  },
});

const BaseModal = createComponent('div', {
  displayName: 'Modal',
  defaultStyles: props => ({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'static',
    height: '100%',
    ...(props.fixed ? { position: 'fixed' } : {}),
    ...(props.backdrop ? { backgroundColor: 'hsla(0,0%,9%,.5)' } : {}),
  }),
  variants: [booleanVariant('fixed', true), booleanVariant('backdrop', true)],
});

interface ModalProps {
  allowScrolling?: boolean;
  backdrop?: boolean;
  contentRef?: MutableRefObject<HTMLElement | null>;
  fixed?: boolean;
  children?: ReactNode;
  /** Close button label (default close modal) */
  /**
   * Unique id of the modal
   */
  id?: string;
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
  contentRef,
  fixed = true,
  children,
  id: outerId,
  onClose,
  open = true,
}: ModalProps) {
  const idTemplate = useGenerateId();
  const id = useMemo(() => {
    return outerId || `modal-${idTemplate}`;
  }, [outerId, idTemplate]);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const zIndex = useLayerManager();
  const onClickAwayHandler: MouseEventHandler = useCallback(
    e => {
      if (
        onClose &&
        ((contentRef &&
          contentRef.current !== e.currentTarget &&
          e.currentTarget === e.target) ||
          (contentRef == null &&
            (e.target === modalRef.current ||
              e.target === backdropRef.current)))
      ) {
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
        <Backdrop onClick={onClickAwayHandler} />
        <BaseModal
          onClick={onClickAwayHandler}
          backdrop={backdrop}
          fixed={fixed}
          onKeyDown={onEscKeyDownHandler}
          ref={modalRef}
          styles={{ zIndex: zIndex + 1 }}
        >
          {children}
        </BaseModal>
      </LayerManager>
    </Portal>
  );
}
