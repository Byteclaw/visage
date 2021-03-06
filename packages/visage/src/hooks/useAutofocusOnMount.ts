import { RefObject } from 'react';
import { useStaticEffect } from './useStaticEffect';

function focusElementOnMount(
  elementToFocusRef:
    | null
    | undefined
    | React.RefObject<HTMLElement | null | undefined>,
  /** Should we focus element? */
  focus: boolean,
) {
  if (focus && elementToFocusRef && elementToFocusRef.current) {
    elementToFocusRef.current.focus();
  }
}

/**
 * Autofocuses element on mount
 */
export function useAutofocusOnMount(
  ref?: null | RefObject<HTMLElement>,
  /** Should we focus element? */
  focus: boolean = true,
) {
  useStaticEffect(focusElementOnMount, ref, focus);
}
