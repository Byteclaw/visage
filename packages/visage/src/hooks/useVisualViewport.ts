import { useStaticEffect } from './useStaticEffect';

enum Device {
  ipad,
  iphone,
  ipod,
  other,
}

export interface VisualViewport {
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly height: number;
  readonly maxHeight: number;
  readonly maxWidth: number;
  readonly width: number;
}

interface VisualViewportSizeListener {
  (viewport: VisualViewport): void;
}

function isPortrait(window: Window) {
  return window.innerWidth < window.innerHeight;
}

function acceptsKeyboardInput(document: Document) {
  const { activeElement } = document;

  if (activeElement == null) {
    return false;
  }

  const isDisabled =
    activeElement.hasAttribute('disabled') ||
    activeElement.getAttribute('aria-disabled') === 'true';
  const isReadOnly =
    activeElement.hasAttribute('readonly') ||
    activeElement.getAttribute('aria-readonly') === 'true';

  switch (activeElement.tagName) {
    case 'TEXTAREA': {
      return !isDisabled && !isReadOnly;
    }
    case 'INPUT': {
      const type = activeElement.getAttribute('type');

      return (
        !isDisabled &&
        !isReadOnly &&
        type !== 'checkbox' &&
        type !== 'radio' &&
        type !== 'file' &&
        type !== 'button'
      );
    }
    default: {
      if ((activeElement as HTMLElement).isContentEditable) {
        return !isDisabled && !isReadOnly;
      }

      return false;
    }
  }
}

function chromeBarHeight(window: Window, device: Device): number {
  if (device === Device.other) {
    return 0;
  }

  if (window.scrollY > 0) {
    return 50;
  }

  return 0;
}

function softKeyboardHeight(
  document: Document,
  window: Window,
  device: Device,
): number {
  if (device === Device.other || !acceptsKeyboardInput(document)) {
    return 0;
  }

  const portrait = isPortrait(window);

  if (device !== Device.ipad) {
    return portrait ? 240 : 190;
  }

  return portrait ? 280 : 370;
}

function detectDevice(window: Window): Device {
  const platform = (window.navigator.platform as any) as string;

  if (/iPad/.test(platform)) {
    return Device.ipad;
  }

  if (/iPhone/.test(platform)) {
    return Device.iphone;
  }

  if (/iPod/.test(platform)) {
    return Device.ipod;
  }

  return Device.other;
}

function computeViewportSize(
  document: Document,
  window: Window,
  device: Device,
): VisualViewport {
  const {
    innerHeight,
    innerWidth,
    scrollX,
    scrollY,
    pageXOffset,
    pageYOffset,
    // @ts-ignore
    visualViewport,
  } = window;

  if (visualViewport) {
    return {
      offsetLeft: visualViewport.pageLeft + visualViewport.offsetLeft,
      offsetTop: visualViewport.pageTop + visualViewport.offsetTop,
      height: visualViewport.height,
      maxHeight: document.documentElement.scrollHeight,
      maxWidth: document.documentElement.scrollWidth,
      width: visualViewport.width,
    };
  }

  return {
    offsetLeft: scrollX ?? pageXOffset ?? 0,
    offsetTop: scrollY ?? pageYOffset ?? 0,
    height:
      innerHeight -
      softKeyboardHeight(document, window, device) -
      chromeBarHeight(window, device),
    maxHeight: document.documentElement.scrollHeight,
    maxWidth: document.documentElement.scrollWidth,
    width: innerWidth,
  };
}

function listenToVisualViewportChangesEffect(
  onChange: VisualViewportSizeListener,
) {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const { visualViewport } = window as any;
    const device = detectDevice(window);
    let computedViewport = computeViewportSize(document, window, device);
    const handler = () => {
      const newViewport = computeViewportSize(document, window, device);

      if (
        computedViewport.height !== newViewport.height ||
        computedViewport.width !== newViewport.width ||
        computedViewport.offsetLeft !== newViewport.offsetLeft ||
        computedViewport.offsetTop !== newViewport.offsetTop ||
        computedViewport.maxHeight !== newViewport.maxHeight ||
        computedViewport.maxWidth !== newViewport.maxWidth
      ) {
        computedViewport = newViewport;

        onChange(computedViewport);
      }
    };

    // if there is a visual viewport, use it
    if (visualViewport) {
      visualViewport.addEventListener('resize', handler);
      visualViewport.addEventListener('scroll', handler);

      // call onChange for the first time
      onChange(computedViewport);

      return () => {
        visualViewport.removeEventListener('resize', handler);
        visualViewport.removeEventListener('scroll', handler);
      };
    }

    let stop = false;

    // if platform is iOS then use pooled checker
    if (device !== Device.other) {
      const detector = () => {
        if (stop) {
          return;
        }

        handler();

        window.requestAnimationFrame(detector);
      };

      window.requestAnimationFrame(detector);
    }

    // if platform is iOS then use pooled checker
    // and also window.resize
    window.addEventListener('resize', handler);

    // call on change for the first time
    onChange(computedViewport);

    return () => {
      stop = true;
      window.removeEventListener('resize', handler);
    };
  }
}

/**
 * Computes visual viewport and calls listener on every change to it's properties
 */
export function useVisualViewport(listener: VisualViewportSizeListener) {
  useStaticEffect(listenToVisualViewportChangesEffect, listener);
}
