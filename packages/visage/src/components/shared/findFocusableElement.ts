import {
  findNextMatchingSiblingElement,
  findPreviousMatchingSiblingElement,
} from './findMatchingSiblingElement';

/** Is this element focusable by keyboard? */
export function isFocusableElement(currentElement: HTMLElement): boolean {
  return currentElement.tabIndex !== -1;
}

export function findPreviousFocusableElement(
  currentElement: HTMLElement,
): HTMLElement | null {
  return findPreviousMatchingSiblingElement(currentElement, isFocusableElement);
}

export function findNextFocusableElement(
  currentElement: HTMLElement,
): HTMLElement | null {
  return findNextMatchingSiblingElement(currentElement, isFocusableElement);
}
