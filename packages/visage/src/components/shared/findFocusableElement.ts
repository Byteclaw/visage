export function isFocusableElement(currentElement: HTMLElement): boolean {
  return currentElement.tabIndex !== -1;
}

function findFocusableElement(
  currentElement: HTMLElement,
  /**
   * Look in previous siblings
   */
  reverse: boolean = false,
): HTMLElement | null {
  let currentItem: HTMLElement | null = currentElement;
  let focusable = false;

  do {
    currentItem = currentItem
      ? (currentItem[
          reverse ? 'previousElementSibling' : 'nextElementSibling'
        ] as (HTMLElement | null))
      : null;
    focusable = currentItem ? isFocusableElement(currentItem) : false;
  } while (!focusable && currentItem);

  return currentItem;
}

export function findPreviousFocusableElement(
  currentElement: HTMLElement,
): HTMLElement | null {
  return findFocusableElement(currentElement, true);
}

export function findNextFocusableElement(
  currentElement: HTMLElement,
): HTMLElement | null {
  return findFocusableElement(currentElement);
}
