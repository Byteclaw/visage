import {
  enableBodyScroll as unlockBodyScroll,
  disableBodyScroll as lockBodyScroll,
} from 'body-scroll-lock';
import { RefObject } from 'react';

/** Scrolls aria-selected="true" child of container identified by ref into view */
export function scrollAriaSelectedElementToView(
  containerRef: RefObject<HTMLElement>,
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

/**
 * Disables body scroll if disabled is true
 */
export function disableBodyScroll(
  { current }: RefObject<HTMLElement>,
  disabled: boolean,
) {
  if (!disabled || !current) {
    return;
  }

  lockBodyScroll(current);

  return () => unlockBodyScroll(current);
}
