import { KeyboardEvent as ReactKeyboardEvent } from 'react';

export function normalizeKeyboardEventKey(
  event: ReactKeyboardEvent | KeyboardEvent,
): string {
  const { key, keyCode } = event;

  if (keyCode >= 37 && keyCode <= 40 && key.indexOf('Arrow') !== 0) {
    return `Arrow${key}`;
  }

  if (key === 'Esc') {
    return 'Escape';
  }

  return key;
}
