export function findMatchingSiblingElement(
  currentElement: HTMLElement,
  condition: (el: HTMLElement) => boolean,
  /**
   * Look in previous siblings
   */
  reverse: boolean = false,
): HTMLElement | null {
  let currentItem: HTMLElement | null = currentElement;
  let found = false;

  do {
    currentItem = currentItem
      ? (currentItem[
          reverse ? 'previousElementSibling' : 'nextElementSibling'
        ] as HTMLElement | null)
      : null;
    found = currentItem ? condition(currentItem) : false;
  } while (!found && currentItem);

  return currentItem;
}

export function findPreviousMatchingSiblingElement(
  currentElement: HTMLElement,
  condition: (el: HTMLElement) => boolean,
) {
  return findMatchingSiblingElement(currentElement, condition, true);
}

export function findNextMatchingSiblingElement(
  currentElement: HTMLElement,
  condition: (el: HTMLElement) => boolean,
) {
  return findMatchingSiblingElement(currentElement, condition);
}
