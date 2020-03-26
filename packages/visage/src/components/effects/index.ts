import { RefObject } from 'react';

/** Scrolls aria-selected="true" child of container identified by ref into view */
export function scrollAriaSelectedElementToView(
  containerRef: RefObject<HTMLDivElement>,
  // we don't use this but we need this for effect to be invoked
  // eslint-disable-next-line
  index: number,
) {
  containerRef.current
    ?.querySelector('[aria-selected="true"]')
    ?.scrollIntoView({
      block: 'nearest',
      inline: 'start',
    });
}
