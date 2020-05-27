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
  const { current } = containerRef;

  if (!current) {
    return;
  }

  const selectedItem = current.querySelector<HTMLElement>(
    '[aria-selected="true"]',
  );

  if (selectedItem) {
    const containerScrollTop = current.scrollTop;
    const containerHeight = current.offsetHeight;
    const isVisible =
      selectedItem.offsetTop >= containerScrollTop &&
      selectedItem.offsetTop <= containerScrollTop + containerHeight;

    if (!isVisible) {
      current.scrollTop = selectedItem.offsetTop;
    }
  }
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

  lockBodyScroll(current, {
    allowTouchMove: el => {
      // allow to scroll children on iOS
      if (current.contains(el)) {
        return true;
      }

      return false;
    },
  });

  return () => unlockBodyScroll(current);
}

/**
 * Detects if radio is checked or unchecked if radio is not controlled
 */
export function detectRadioCheckedState(
  radioRef: RefObject<HTMLInputElement>,
  isControlled: boolean,
  isReadOnly: boolean,
  setChecked: (checked: boolean) => void,
) {
  // if input is controlled, we don't want to use internal state
  if (isControlled || isReadOnly || typeof document === 'undefined') {
    return;
  }

  const onChangeListener = ({ target }: Event) => {
    // if target is input with radio type, check if the name is the same as with radioRef
    // and if the form is same
    const { current } = radioRef;

    if (!current) {
      return;
    }

    if (target instanceof HTMLInputElement && target.type === 'radio') {
      // if target is the same as ref, then we checked the radio
      if (target === current) {
        setChecked(true);
      } else if (target.name === current.name && target.form === current.form) {
        // if name and form are the same, then they belong to one form so we can uncheck this one
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#Properties
        setChecked(false);
      }
    }
  };

  // mount document on change
  document.addEventListener('change', onChangeListener);

  return () => {
    document.removeEventListener('change', onChangeListener);
  };
}
