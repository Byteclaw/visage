import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import { RefObject } from 'react';

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

/**
 * Creates a focus trap callback that can be used as an event handler for focus events
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
  return useStaticCallbackCreator(focusTrap, [contentRef, toFocusElementRef]);
}
