import { useUniqueId } from '@byteclaw/use-unique-id';
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
import { booleanVariant } from '../variants';
import { LayerManager, useLayerManager } from './LayerManager';
import { Portal } from './Portal';

const Backdrop = createComponent('div', {
  displayName: 'ModalBackdrop',
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
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'static',
    p: 2,
    height: '100%',
    ...(props.scrollable ? { overflowY: 'scroll' } : {}),
    ...(props.fixed ? { position: 'fixed' } : {}),
    ...(props.backdrop ? { backgroundColor: 'hsla(0,0%,9%,.5)' } : {}),
  }),
  variants: [
    booleanVariant('fixed', true),
    booleanVariant('backdrop', true),
    booleanVariant('scrollable', true),
  ],
});

interface ModalProps {
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
   * Is scrolling for really big modal enabled?
   */
  scrollable?: boolean;
  /**
   * Accessibility role, use alert dialog if you need user's interaction
   * Default is dialog (you don't need users immediate action)
   */
  open: boolean;
  /**
   * Should we allow to scroll document body?
   */
  unlockBodyScroll?: boolean;
}

export function Modal({
  unlockBodyScroll = false,
  backdrop = true,
  contentRef,
  fixed = true,
  children,
  id: outerId,
  onClose,
  open = true,
  scrollable = false,
}: ModalProps) {
  const idTemplate = useUniqueId();
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
      if (!unlockBodyScroll && open) {
        disableBodyScroll(modalRef.current as HTMLElement);
      } else {
        enableBodyScroll(modalRef.current as HTMLElement);
      }
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [unlockBodyScroll, open, modalRef.current]);

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
          scrollable={scrollable}
          styles={{ zIndex: zIndex + 1 }}
        >
          {children}
        </BaseModal>
      </LayerManager>
    </Portal>
  );
}
