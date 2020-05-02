import React, {
  ReactNode,
  useRef,
  MutableRefObject,
  useContext,
  RefObject,
} from 'react';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';
import { LayerManager, useLayerManager } from './LayerManager';
import { Portal } from './Portal';
import {
  useAutofocusOnMount,
  useFocusTrap,
  useStaticOnRenderEffect,
  useStaticEffect,
  useUniqueId,
} from '../hooks';
import {
  CloseListenerManagerContext,
  CloseListenerManagerContextAPI,
} from './CloseListenerManager';
import { disableBodyScroll } from './effects';

const BaseModal = createComponent('div', {
  displayName: 'Modal',
  styles: props => ({
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
    ...(props.backdrop && props.fixed
      ? { backgroundColor: 'hsla(0,0%,9%,.5)' }
      : {}),
  }),
  variants: [
    booleanVariant('fixed', true),
    booleanVariant('backdrop', true),
    booleanVariant('scrollable', true),
  ],
});

function bindOnCloseListeners(
  open: boolean,
  closeListenerManagerContext: CloseListenerManagerContextAPI,
  preventCloseRefs: RefObject<HTMLElement>[],
  modalRef: RefObject<HTMLElement>,
  isFullscreen: boolean,
  onClose: undefined | (() => void),
  disableOnEscapeClose: boolean = false,
  disableOnClickAwayClose: boolean = false,
) {
  if (!onClose || !open) {
    return;
  }

  const unregisterClickAway = disableOnClickAwayClose
    ? () => {}
    : closeListenerManagerContext.registerClickAwayListener(
        [modalRef, ...preventCloseRefs],
        onClose,
        isFullscreen,
      );
  const unregisterEscapeKeyUp = disableOnEscapeClose
    ? () => {}
    : closeListenerManagerContext.registerEscapeKeyUpListener(onClose);

  return () => {
    unregisterClickAway();
    unregisterEscapeKeyUp();
  };
}

interface ModalProps {
  /**
   * Backdrop enables visible background overlay
   */
  backdrop?: boolean;
  /**
   * Ref object to content, basically you want to render a div inside a Modal
   * so contentRef should be a ref to the div
   */
  contentRef?: MutableRefObject<HTMLElement | null>;
  disableOnClickAwayClose?: boolean;
  disableOnEscapeClose?: boolean;
  children?: ReactNode;
  /**
   * Render modal content as position: fixed
   */
  fixed?: boolean;
  /** Close button label (default close modal) */
  /**
   * Unique id of the modal
   */
  id?: string;
  onClose?: () => void;
  /**
   * When content overflows screen height should we scroll the modal content?
   */
  scrollable?: boolean;
  /**
   * Accessibility role, use alert dialog if you need user's interaction
   * Default is dialog (you don't need users immediate action)
   */
  open: boolean;
  /**
   * This element will be focused on mount and will receive focus from focus trap
   */
  focusElementRef?: MutableRefObject<HTMLElement | null>;
  /**
   * Extra elements that should not propagate onClose when click away is enabled
   *
   * This prop is immutable so make sure you don't use a new array because only first one is being used
   */
  preventCloseRefs?: MutableRefObject<HTMLElement | null>[];
  /**
   * Should we allow to scroll document body?
   */
  unlockBodyScroll?: boolean;
}

/**
 * Modal
 *
 * Works as a focus trap
 */
export function Modal({
  disableOnClickAwayClose,
  disableOnEscapeClose,
  unlockBodyScroll = false,
  backdrop = true,
  contentRef,
  fixed = true,
  children,
  id: outerId,
  onClose,
  open = true,
  focusElementRef,
  preventCloseRefs = [],
  scrollable = false,
}: ModalProps) {
  const id = useUniqueId(outerId, 'modal-portal');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeListenerManagerContext = useContext(CloseListenerManagerContext);
  const { zIndex } = useLayerManager();

  useFocusTrap(contentRef || modalRef, focusElementRef);
  useAutofocusOnMount(focusElementRef);
  useStaticOnRenderEffect(
    bindOnCloseListeners,
    open,
    closeListenerManagerContext,
    // this one is not picked up on update so be careful
    preventCloseRefs,
    contentRef || modalRef,
    backdrop,
    onClose,
    disableOnEscapeClose,
    disableOnClickAwayClose,
  );
  useStaticEffect(disableBodyScroll, modalRef, !unlockBodyScroll && open);

  if (typeof document === 'undefined' || !open) {
    return null;
  }

  return (
    <Portal containerId={id}>
      <LayerManager>
        <BaseModal
          backdrop={backdrop}
          fixed={fixed}
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
