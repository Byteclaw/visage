/* eslint-disable react/destructuring-assignment, no-param-reassign */
import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import React, {
  MutableRefObject,
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useRef,
} from 'react';
import { useStaticEffect } from '../hooks';
import { normalizeKeyboardEventKey } from './shared';

export type OnCloseHandler = (
  e: KeyboardEvent | MouseEvent | React.MouseEvent | React.KeyboardEvent,
) => unknown | Promise<unknown>;

interface ClickAwayHandler {
  refs: RefObject<HTMLElement>[];
  onClose: OnCloseHandler;
  isFullscreen: boolean;
}

export interface CloseListenerManagerContextAPI {
  /**
   * Returns a function that must be called to deregister the listener if component is unmounted
   */
  registerEscapeKeyUpListener(listener: OnCloseHandler): () => void;
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
    /**
     * Elements that needs to contain click in order to prevent the element from closing
     *
     * At least one must be matched
     */
    refs: RefObject<HTMLElement>[],
    listener: OnCloseHandler,
    isFullscreen?: boolean,
  ): () => void;
}

export const CloseListenerManagerContext =
  createContext<CloseListenerManagerContextAPI>({
    registerClickAwayListener() {
      return () => {};
    },
    registerEscapeKeyUpListener() {
      return () => {};
    },
  });

/**
 * Connects to CloseListenerManager
 */
export function useCloseListenerManager(): CloseListenerManagerContextAPI {
  return useContext(CloseListenerManagerContext);
}

function onEscapeKeyUpHandlerCreator(
  escapeStack: MutableRefObject<OnCloseHandler[]>,
  resolutionRef: MutableRefObject<boolean>,
) {
  return async (e: KeyboardEvent) => {
    if (
      normalizeKeyboardEventKey(e) === 'Escape' &&
      escapeStack.current &&
      escapeStack.current.length > 0 &&
      !resolutionRef.current
    ) {
      // set as resolving
      resolutionRef.current = true;

      // get the last added listener but do not mutate the array
      // the component will unregister it's listener on unmount
      // we don't propagate close any further because using escape you want to close only
      // the top most element (for example Menu in Drawer)
      try {
        await escapeStack.current[escapeStack.current.length - 1](e);
      } finally {
        resolutionRef.current = false;
      }
    }
  };
}

function onClickAwayHandlerCreator(
  clickAwayStack: MutableRefObject<ClickAwayHandler[]>,
  resolutionRef: MutableRefObject<boolean>,
) {
  return async (e: MouseEvent) => {
    // go from last added and close it if target is not a part of element
    // repeat until we reach full screen listener
    if (
      !clickAwayStack.current ||
      clickAwayStack.current.length === 0 ||
      resolutionRef.current
    ) {
      return;
    }

    // set as resolving
    resolutionRef.current = true;

    for (let i = clickAwayStack.current.length - 1; i >= 0; i--) {
      const { isFullscreen, onClose, refs } = clickAwayStack.current[i];

      const shouldNotClose =
        // if you select something in an input and move cursor outside during the selection
        // this will prevent from closing
        window.getSelection()?.toString() ||
        !!refs.find(
          ref => ref.current && ref.current.contains(e.target as Node),
        );

      if (!shouldNotClose) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await onClose(e);
        } catch (err) {
          resolutionRef.current = false;

          throw err;
        }

        // if user prevented default or the element is fullscreen (backdrop is used?)
        // do not go any further
        // do not go any further if given element is fullscreen
        if (e.defaultPrevented || isFullscreen) {
          break;
        }
      } else if (isFullscreen) {
        break;
      }
    }

    resolutionRef.current = false;
  };
}

function bindEventListeners(
  escapeKeyUpListener: (e: KeyboardEvent) => any,
  clickAwayListener: (e: MouseEvent) => any,
) {
  if (typeof document === 'undefined') {
    return;
  }

  document.addEventListener('keyup', escapeKeyUpListener, true);
  document.addEventListener('click', clickAwayListener, true);

  return () => {
    document.removeEventListener('click', clickAwayListener, true);
    document.removeEventListener('keyup', escapeKeyUpListener, true);
  };
}

function createRegisterEscapeListener(
  escapeStack: MutableRefObject<OnCloseHandler[]>,
) {
  return (onClose: OnCloseHandler) => {
    escapeStack.current = [...escapeStack.current, onClose];

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
    /**
     * List of refs to elements that should contain a click
     */
    refs: RefObject<HTMLElement>[],
    onClose: OnCloseHandler,
    isFullscreen: boolean = true,
  ) => {
    if (!clickAwayStack.current) {
      return () => {};
    }

    clickAwayStack.current = ([] as ClickAwayHandler[]).concat(
      clickAwayStack.current,
      [{ isFullscreen, refs, onClose }],
    );

    return () => {
      clickAwayStack.current = clickAwayStack.current.filter(
        listener => listener.onClose !== onClose,
      );
    };
  };
}

interface Props {
  children?: ReactNode;
}

export function CloseListenerManager({ children }: Props): React.ReactElement {
  /** says whether we are in the middle of on close resolution */
  const resolutionRef = useRef<boolean>(false);
  const escapeStack = useRef<OnCloseHandler[]>([]);
  const clickAwayStack = useRef<ClickAwayHandler[]>([]);
  const registerEscapeKeyUpListener = useStaticCallbackCreator(
    createRegisterEscapeListener,
    [escapeStack],
  );
  const registerClickAwayListener = useStaticCallbackCreator(
    createRegisterClickAwayListener,
    [clickAwayStack],
  );
  const context = useRef<CloseListenerManagerContextAPI>({
    registerClickAwayListener,
    registerEscapeKeyUpListener,
  });
  const onEscapeKeyUp = useStaticCallbackCreator(onEscapeKeyUpHandlerCreator, [
    escapeStack,
    resolutionRef,
  ]);
  const onClickAway = useStaticCallbackCreator(onClickAwayHandlerCreator, [
    clickAwayStack,
    resolutionRef,
  ]);

  useStaticEffect(bindEventListeners, onEscapeKeyUp, onClickAway);

  return (
    <CloseListenerManagerContext.Provider value={context.current}>
      {children}
    </CloseListenerManagerContext.Provider>
  );
}
