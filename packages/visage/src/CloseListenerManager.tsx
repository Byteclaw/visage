/* eslint-disable react/destructuring-assignment, no-param-reassign */
import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import React, {
  MutableRefObject,
  ReactNode,
  RefObject,
  createContext,
  useRef,
} from 'react';
import { useStaticEffect } from './hooks';

type OnCloseHandler = () => any;

interface ClickAwayHandler {
  ref: RefObject<HTMLElement>;
  onClose: OnCloseHandler;
  isFullscreen: boolean;
}

export interface CloseListenerManagerContextAPI {
  /**
   * Returns a function that must be called to deregister the listener if component is unmounted
   */
  registerEscapeKeyDownListener(listener: OnCloseHandler): () => void;
  /**
   * Register click away listener that will propagate close on non full screen listeners
   *
   * For example you have Dialog 2 open above a Dialog 1, you want to close only Dialog 1 because
   * dialog is full screen
   *
   * In case when there is a Menu open in Dialog you want to propagate close to Dialog
   * so if you click outside of Dialog you want to close not only the Menu but the Dialog too
   *
   * Returns a function that must be called to deregister the listener if component is unmounted
   */
  registerClickAwayListener(
    ref: RefObject<HTMLElement>,
    listener: OnCloseHandler,
    isFullscreen?: boolean,
  ): () => void;
}

export const CloseListenerManagerContext = createContext<
  CloseListenerManagerContextAPI
>({
  registerClickAwayListener() {
    return () => {};
  },
  registerEscapeKeyDownListener() {
    return () => {};
  },
});

function onEscapeKeyDownHandlerCreator(
  escapeStack: MutableRefObject<OnCloseHandler[]>,
) {
  return (e: KeyboardEvent) => {
    if (
      e.key === 'Escape' &&
      escapeStack.current &&
      escapeStack.current.length > 0
    ) {
      // get the last added listener but do not mutate the array
      // the component will unregister it's listener on unmount
      // we don't propagate close any further because using escape you want to close only
      // the top most element (for example Menu in Drawer)
      escapeStack.current[escapeStack.current.length - 1]();
    }
  };
}

function onClickAwayHandlerCreator(
  clickAwayStack: MutableRefObject<ClickAwayHandler[]>,
) {
  return (e: MouseEvent) => {
    // go from last added and close it if target is not a part of element
    // repeat until we reach full screen listener
    if (!clickAwayStack.current || clickAwayStack.current.length === 0) {
      return;
    }

    for (let i = clickAwayStack.current.length - 1; i >= 0; i--) {
      const { isFullscreen, onClose, ref } = clickAwayStack.current[i];

      if (ref.current) {
        if (!ref.current.contains(e.target as any)) {
          onClose();

          // do not go any further if given element is fullscreen
          if (isFullscreen) {
            break;
          }
        } else {
          // do not go any further if the click is from element's children
          break;
        }
      } else if (isFullscreen) {
        break;
      }
    }
  };
}

function bindEventListeners(
  escapeKeyDownListener: (e: KeyboardEvent) => any,
  clickAwayListener: (e: MouseEvent) => any,
) {
  if (typeof document === 'undefined') {
    return;
  }

  document.addEventListener('keydown', escapeKeyDownListener);
  document.addEventListener('click', clickAwayListener, true);

  return () => {
    document.removeEventListener('click', clickAwayListener, true);
    document.removeEventListener('keydown', escapeKeyDownListener);
  };
}

function createRegisterEscapeListener(
  escapeStack: MutableRefObject<OnCloseHandler[]>,
) {
  return (onClose: OnCloseHandler) => {
    if (!escapeStack.current) {
      return () => {};
    }

    escapeStack.current = ([] as OnCloseHandler[]).concat(escapeStack.current, [
      onClose,
    ]);

    return () => {
      escapeStack.current = escapeStack.current.filter(
        listener => listener !== onClose,
      );
    };
  };
}

function createRegisterClickAwayListener(
  clickAwayStack: MutableRefObject<ClickAwayHandler[]>,
) {
  return (
    ref: RefObject<HTMLElement>,
    onClose: OnCloseHandler,
    isFullscreen: boolean = true,
  ) => {
    if (!clickAwayStack.current) {
      return () => {};
    }

    clickAwayStack.current = ([] as ClickAwayHandler[]).concat(
      clickAwayStack.current,
      [{ isFullscreen, ref, onClose }],
    );

    return () => {
      clickAwayStack.current = clickAwayStack.current.filter(
        listener => listener.onClose !== onClose,
      );
    };
  };
}

interface Props {
  children: ReactNode;
}

export function CloseListenerManager({ children }: Props) {
  const escapeStack = useRef<OnCloseHandler[]>([]);
  const clickAwayStack = useRef<ClickAwayHandler[]>([]);
  const registerEscapeKeyDownListener = useStaticCallbackCreator(
    createRegisterEscapeListener,
    [escapeStack],
  );
  const registerClickAwayListener = useStaticCallbackCreator(
    createRegisterClickAwayListener,
    [clickAwayStack],
  );
  const context = useRef<CloseListenerManagerContextAPI | undefined>();
  const onEscapeKeyDown = useStaticCallbackCreator(
    onEscapeKeyDownHandlerCreator,
    [escapeStack],
  );
  const onClickAway = useStaticCallbackCreator(onClickAwayHandlerCreator, [
    clickAwayStack,
  ]);

  useStaticEffect(bindEventListeners, onEscapeKeyDown, onClickAway);

  if (context.current == null) {
    context.current = {
      registerClickAwayListener,
      registerEscapeKeyDownListener,
    };
  }

  return (
    <CloseListenerManagerContext.Provider value={context.current!}>
      {children}
    </CloseListenerManagerContext.Provider>
  );
}