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
    document: {
      documentElement: { scrollHeight, scrollWidth, clientHeight, clientWidth },
    },
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
      clientHeight -
      softKeyboardHeight(document, window, device) -
      chromeBarHeight(window, device),
    maxHeight: scrollHeight,
    maxWidth: scrollWidth,
    width: clientWidth,
  };
}

function listenToVisualViewportChangesEffect(
  onChange: VisualViewportSizeListener,
  watchForChanges: boolean,
  /**
   * Scrollable container of an anchor (if we have an element inside other scrollable container than body)
   */
  scrollContainerRef?: React.RefObject<HTMLElement>,
) {
  if (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    watchForChanges
  ) {
    const { visualViewport } = window as any;
    const device = detectDevice(window);
    const computedViewport = computeViewportSize(document, window, device);

    let ticking = false;

    const recomputeViewport = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newViewport = computeViewportSize(document, window, device);

          onChange(newViewport);

          ticking = false;
        });

        ticking = true;
      }
    };

    // listen to changes
    visualViewport?.addEventListener('resize', recomputeViewport);
    visualViewport?.addEventListener('scroll', recomputeViewport);
    window.addEventListener('resize', recomputeViewport);
    window.addEventListener('scroll', recomputeViewport);
    scrollContainerRef?.current?.addEventListener('scroll', recomputeViewport);

    onChange(computedViewport);

    return () => {
      visualViewport?.removeEventListener('resize', recomputeViewport);
      visualViewport?.removeEventListener('scroll', recomputeViewport);
      window.removeEventListener('resize', recomputeViewport);
      window.removeEventListener('scroll', recomputeViewport);
      scrollContainerRef?.current?.removeEventListener(
        'scroll',
        recomputeViewport,
      );
    };
  }
}

/**
 * Computes visual viewport and calls listener on every change to it's properties
 */
export function useVisualViewport(
  listener: VisualViewportSizeListener,
  {
    watchForChanges = true,
    scrollContainerRef,
  }: {
    /**
     * Should watch for changes?
     *
     * @default true
     */
    watchForChanges: boolean;
    /**
     * Scrollable container of an anchor (if we have an element inside other scrollable container than body)
     */
    scrollContainerRef?: React.RefObject<HTMLElement>;
  },
): void {
  useStaticEffect(
    listenToVisualViewportChangesEffect,
    listener,
    watchForChanges,
    scrollContainerRef,
  );
}
