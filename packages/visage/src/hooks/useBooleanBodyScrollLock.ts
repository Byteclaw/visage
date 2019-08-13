import { ReactNode, useEffect } from 'react';
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock';

export function useBooleanBodyScrollLock(
  enable: boolean,
  targetElement: ReactNode,
): any {
  return useEffect(() => {
    if (targetElement != null) {
      if (enable) {
        disableBodyScroll(targetElement as HTMLElement);
      } else {
        enableBodyScroll(targetElement as HTMLElement);
      }
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [enable, targetElement]);
}
