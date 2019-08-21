import { KeyboardEvent } from 'react';

export function normalizeKeyboardEventKey(event: KeyboardEvent): string {
  const { key, keyCode } = event;

  if (keyCode >= 37 && keyCode <= 40 && key.indexOf('Arrow') !== 0) {
    return `Arrow${key}`;
  }
  return key;
}
