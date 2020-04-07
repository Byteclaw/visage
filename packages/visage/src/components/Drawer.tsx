import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import React, { ReactElement, ReactNode, RefObject, useRef } from 'react';
import {
  CloseListenerManagerContextAPI,
  OnCloseHandler,
  useCloseListenerManager,
} from './CloseListenerManager';
import { createComponent } from '../core';
import {
  useFocusTrap,
  useStaticOnRenderEffect,
  useStaticEffect,
  useUniqueId,
  useAutofocusOnMount,
} from '../hooks';
import { booleanVariant, numberProp, variant } from '../variants';
import { disableBodyScroll } from './effects';
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
    backgroundColor: 'shades',
    overflowY: 'scroll',
    ...(props.relative
      ? { position: 'relative' }
      : {
          position: 'fixed',
          zIndex: props.zIndex,
          boxShadow:
            '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
          bottom: props.side !== 'top' ? 0 : null,
          top: props.side !== 'bottom' ? 0 : null,
          left: props.side !== 'right' ? 0 : null,
          right: props.side !== 'left' ? 0 : null,
          height:
            props.side !== 'left' && props.side !== 'right'
              ? ['90vh', '75vh', '50vh']
              : null,
          width:
            props.side !== 'top' && props.side !== 'bottom'
              ? ['90vw', '75vw', '50vw']
              : null,
        }),
  }),
  variants: [
    variant('side', true, ['bottom', 'left', 'right', 'top']),
    booleanVariant('relative', true),
    numberProp('zIndex', true),
  ],
});

function bindOnCloseListeners(
  closeListenerManager: CloseListenerManagerContextAPI,
  baseRef: RefObject<HTMLElement>,
  open: boolean,
  relative: boolean,
  isFullscreen: boolean,
  onClose?: OnCloseHandler,
) {
  // if drawer is relative we can't close it
  if (relative || !open || !onClose) {
    return;
  }

  // if drawer is open, register close listeners
  const unregisterClickAway = closeListenerManager.registerClickAwayListener(
    baseRef,
    onClose,
    isFullscreen,
  );
  const unregisterEscapeKeyUp = closeListenerManager.registerEscapeKeyUpListener(
    onClose,
  );

  return () => {
    unregisterClickAway();
    unregisterEscapeKeyUp();
  };
}

interface DrawerProps extends ExtractVisageComponentProps<typeof BaseDrawer> {
  /**
   * Enables to completely disable backdrop even if Drawer is closable, default is true
   *
   * Backdrop prevents bubbling onClose event to underlying layers, if you don't use a backdrop
   * but you don't want to close drawer on click away, you need to call event.preventDefault()
   * in onClose handler
   */
  backdrop?: boolean;
  children?: ReactNode;
  /**
   * Auto focus element if Drawer is open
   *
   * If backdrop is enabled also focus trap will use this element to focus if Drawer loses focus
   */
  focusElementRef?: RefObject<HTMLElement>;
  /** Render Drawer in Portal, default is true */
  inPortal?: boolean;
  onClose?: OnCloseHandler;
  open?: boolean;
  /**
   * Use relative position instead of fixed
   */
  relative?: boolean;
  side?: DrawerPosition;
}

export function Drawer({
  backdrop = true,
  children,
  focusElementRef,
  id: outerId,
  inPortal = false,
  onClose,
  open = false,
  relative = false,
  side = DrawerPosition.left,
  ...restProps
}: DrawerProps) {
  const id = useUniqueId(outerId, 'drawer');
  const baseRef = useRef<HTMLDivElement>(null);
  const { zIndex } = useLayerManager();
  const closeListenerManager = useCloseListenerManager();

  useStaticOnRenderEffect(
    bindOnCloseListeners,
    closeListenerManager,
    baseRef,
    open,
    relative,
    // if there is a backdrop, the drawer is fullscreen
    // meaning we don't want to bubble onClose when we close outside of drawer
    backdrop,
    onClose,
  );

  useAutofocusOnMount(focusElementRef, open);
  useFocusTrap(baseRef, backdrop && open ? focusElementRef : undefined);
  useStaticEffect(disableBodyScroll, baseRef, !relative && backdrop && open);

  if (relative) {
    return (
      <BaseDrawer relative={relative} {...restProps}>
        {children}
      </BaseDrawer>
    );
  }

  if (!open) {
    return null;
  }

  let drawer: ReactElement | null = (
    <React.Fragment>
      {backdrop ? <Backdrop styles={{ zIndex }} /> : null}
      <BaseDrawer
        id={outerId}
        ref={baseRef}
        side={side}
        zIndex={zIndex + 1}
        {...restProps}
      >
        {children}
      </BaseDrawer>
    </React.Fragment>
  );

  if (inPortal) {
    drawer =
      typeof document === 'undefined' ? null : (
        <Portal containerId={id}>{drawer}</Portal>
      );
  }

  return <LayerManager>{drawer}</LayerManager>;
}
