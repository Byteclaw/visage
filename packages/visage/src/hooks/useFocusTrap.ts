import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import { RefObject } from 'react';
import { useStaticEffect } from './useStaticEffect';

function focusTrap(
  contentRef: RefObject<HTMLElement | null>,
  toFocusElementRef?: RefObject<HTMLElement | null>,
) {
  return (e: FocusEvent) => {
    if (
      contentRef.current &&
      contentRef.current.contains(e.target as any) === false
    ) {
      e.preventDefault();

      // return focus back to element
      if (toFocusElementRef && toFocusElementRef.current) {
        toFocusElementRef.current.focus();
      }
    }
  };
}

function registerFocusTrap(focusTrapHandler: (e: FocusEvent) => void) {
  if (typeof document === 'undefined') {
    return;
  }

  document.addEventListener('focus', focusTrapHandler, true);

  return () => {
    document.removeEventListener('focus', focusTrapHandler, true);
  };
}

/**
 * Creates a focus trap callback that can be used as an event handler for focus events
 */
export function useFocusTrapCallback(
  /**
   * The ref object to content inside which we should trap the focus
   */
  contentRef: RefObject<HTMLElement | null>,
  /**
   * Element to focus inside if we lose focus
   */
  toFocusElementRef?: RefObject<HTMLElement | null>,
) {
  return useStaticCallbackCreator(focusTrap, [contentRef, toFocusElementRef]);
}

/**
 * Registers a focus trap
 */
export function useFocusTrap(
  /**
   * The ref object to content inside which we should trap the focus
   */
  contentRef: RefObject<HTMLElement | null>,
  /**
   * Element to focus inside if we lose focus
   */
  toFocusElementRef?: RefObject<HTMLElement | null>,
) {
  const focusTrapListener = useFocusTrapCallback(contentRef, toFocusElementRef);

  useStaticEffect(registerFocusTrap, focusTrapListener);
}
