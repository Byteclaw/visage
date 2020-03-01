import {
  MouseEventHandler,
  KeyboardEventHandler,
  MouseEvent,
  KeyboardEvent,
} from 'react';

/**
 * This event handler creator prevents default event behaviour if control
 * is read only.
 *
 * That means if click on the control or focus it and press Spacebar
 * default event behaviour is prevented
 */
export function preventDefaultOnReadOnlyControlHandlerCreator(
  readOnly: boolean | undefined,
  onClick: MouseEventHandler | undefined,
  onKeyDown: KeyboardEventHandler | undefined,
): (e: KeyboardEvent | MouseEvent) => void {
  return (e: KeyboardEvent | MouseEvent) => {
    if (readOnly) {
      if ((e as any).key != null && (e as KeyboardEvent).key !== ' ') {
        return;
      }

      e.preventDefault();
    }

    if (onClick && (e as any).key == null) {
      onClick(e as MouseEvent);
    } else if (onKeyDown && (e as any).key != null) {
      onKeyDown(e as KeyboardEvent);
    }
  };
}
