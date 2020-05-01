export interface AnchorOrigin {
  horizontal?: AnchorHorizontalOrigin;
  vertical?: AnchorVerticalOrigin;
}

export type AnchorHorizontalOrigin = 'left' | 'center' | 'right';
export type AnchorVerticalOrigin = 'top' | 'center' | 'bottom';

export interface ElementRect {
  height: number;
  width: number;
  /**
   * Scroll height from an element
   *
   * This is used in case that height is smaller than scroll height,
   * in that case we take scrollHeight as a height for further
   * computation
   */
  scrollHeight: number;
  /**
   * Scroll width from an element
   *
   * This is used in case that width is shorter than scroll width,
   * in that case we take scrollWdith as a width for further
   * computation
   */
  scrollWidth: number;
}

/**
 * Anchor position relative to viewport
 */
export interface AnchorPosition {
  top: number;
  left: number;
}

export interface AnchorPositionAndDimensions extends AnchorPosition {
  height: number;
  width: number;
}

export function getWindowScrollY() {
  // IE 11 - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
  return window.scrollY != null ? window.scrollY : window.pageYOffset;
}

export function getWindowScrollX() {
  // IE 11 - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
  return window.scrollX != null ? window.scrollX : window.pageXOffset;
}

export function getOffsetTop(
  element: HTMLElement | AnchorPositionAndDimensions,
  vertical: AnchorVerticalOrigin = 'top',
): number {
  let offset = 0;
  const height =
    element instanceof HTMLElement ? element.offsetHeight : element.height;

  if (vertical === 'center') {
    offset = height / 2;
  } else if (vertical === 'bottom') {
    offset = height;
  }

  return offset;
}

export function getOffsetLeft(
  element: HTMLElement | AnchorPositionAndDimensions,
  horizontal: AnchorHorizontalOrigin = 'left',
): number {
  let offset = 0;
  const width =
    element instanceof HTMLElement ? element.offsetWidth : element.width;

  if (horizontal === 'center') {
    offset = width / 2;
  } else if (horizontal === 'right') {
    offset = width;
  }

  return offset;
}

export function applyAnchorOrigin(
  anchor: AnchorPositionAndDimensions,
  anchorOrigin: AnchorOrigin,
): AnchorPosition {
  return {
    left: anchor.left + getOffsetLeft(anchor, anchorOrigin.horizontal),
    top: anchor.top + getOffsetTop(anchor, anchorOrigin.vertical),
  };
}

/**
 * Returns anchor position relative to viewport
 */
export function getAnchorPositionAndDimensions(
  anchor: HTMLElement | AnchorPosition,
): AnchorPositionAndDimensions {
  if (anchor instanceof HTMLElement) {
    const anchorRect = anchor.getBoundingClientRect();

    return {
      top: anchorRect.top,
      left: anchorRect.left,
      height: anchorRect.height,
      width: anchorRect.width,
    };
  }

  return {
    ...anchor,
    height: 0,
    width: 0,
  };
}

export interface PositioningStyles {
  left: number;
  height: number;
  minHeight: number;
  minWidth: number;
  top: number;
  width: number;
}

/**
 * Placement says where in the Element anchor element is positioned, first word is vertical origin and second is horizontal
 */
export enum Placement {
  topCenter = 'top-center',
  topLeft = 'top-left',
  topRight = 'top-right',
  bottomCenter = 'bottom-center',
  bottomLeft = 'bottom-left',
  bottomRight = 'bottom-right',
  centerLeft = 'center-left',
  centerRight = 'center-right',
  centerCenter = 'center-center',
}

interface Viewport {
  /** Visible height */
  height: number;
  scrollY: number;
  scrollX: number;
  /** Visible width */
  width: number;
  /** Real height */
  maxHeight: number;
  /** Real width */
  maxWidth: number;
}

interface PlacementRegion {
  /**
   * Does placement region match specified constraint?
   */
  matches: boolean;
  top: number;
  left: number;
  height: number;
  width: number;
  /**
   * Min height that can be used to determine height for an element
   * if constraint is applied
   *
   * This can differ from the height if matches is false
   */
  minHeight: number;
  /**
   * Min width that can be used to determine width for an element
   * if coinstraint is applied
   *
   * This can differ from the width if matches is false
   */
  minWidth: number;
}

export function computePositionAndDimensions(
  viewport: Viewport,
  /**
   * Anchor position with anchor origin already applied
   *
   * Position is relative to viewport
   */
  anchor: AnchorPosition,
  /**
   * Element rect relative to viewport
   */
  element: ElementRect,
  placement: Placement,
  {
    // maxHeight: maxHeightC,
    // maxWidth: maxWidthC,
    minHeight,
    minWidth,
  }: PlacementConstraints = {},
): PlacementRegion {
  const top = anchor.top + viewport.scrollY;
  const left = anchor.left + viewport.scrollX;
  const visibleSpaceToRight = viewport.width - anchor.left;
  const visibleSpaceToLeft = anchor.left;
  const visibleSpaceToTop = anchor.top;
  const visibleSpaceToBottom = viewport.height - anchor.top;
  const elementWidth = Math.max(element.width, element.scrollWidth);
  const elementHeight = Math.max(element.height, element.scrollHeight);

  // now based on placement, compute available region based on anchor position and viewport information
  switch (placement) {
    case Placement.topLeft: {
      // we want an anchor to be in top left corner of an element
      const height = Math.min(viewport.height - anchor.top, elementHeight);
      const width = Math.min(viewport.width - anchor.left, elementWidth);

      return {
        matches:
          Math.max(minHeight ?? visibleSpaceToBottom, visibleSpaceToBottom) <=
            visibleSpaceToBottom &&
          Math.max(minWidth ?? visibleSpaceToRight, visibleSpaceToRight) <=
            visibleSpaceToRight,
        height,
        width,
        left,
        top,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.topRight: {
      // we want an anchor to be in top right corner of an element
      const height = Math.min(viewport.height - anchor.top, elementHeight);
      const width = Math.min(anchor.left, elementWidth);

      return {
        matches:
          Math.min(minHeight ?? visibleSpaceToBottom, visibleSpaceToBottom) <=
            visibleSpaceToBottom &&
          Math.min(minWidth ?? visibleSpaceToLeft, visibleSpaceToLeft) <=
            visibleSpaceToLeft,
        height,
        width,
        top,
        left: left - width,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.topCenter: {
      // we want an anchor to be in the center of the top edge of an element
      const height = Math.min(viewport.height - anchor.top, elementHeight);
      const halfEdge = elementWidth / 2;
      const width =
        Math.min(anchor.left, viewport.width - anchor.left, halfEdge) * 2;

      return {
        matches:
          Math.max(minHeight ?? visibleSpaceToTop, visibleSpaceToTop) <=
            visibleSpaceToTop &&
          Math.max(minWidth ?? visibleSpaceToLeft, visibleSpaceToLeft) <=
            visibleSpaceToLeft &&
          Math.max(minWidth ?? visibleSpaceToRight, visibleSpaceToRight) <=
            visibleSpaceToRight,
        height,
        width,
        left: left - width / 2,
        top,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.bottomLeft: {
      // we want an anchor to be in the bottom left corner of an element
      const height = Math.min(anchor.top, elementHeight);
      const width = Math.min(viewport.width - anchor.left, elementWidth);

      return {
        matches:
          Math.max(minHeight ?? visibleSpaceToTop, visibleSpaceToTop) <=
            visibleSpaceToTop &&
          Math.max(minWidth ?? visibleSpaceToRight, visibleSpaceToRight) <=
            visibleSpaceToRight,
        left,
        top: top - height,
        height,
        width,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.bottomRight: {
      // we want an anchor to be in the bottom right corner of an element
      const width = Math.min(anchor.left, elementWidth);
      const height = Math.min(anchor.top, elementHeight);

      return {
        matches:
          Math.max(minHeight ?? visibleSpaceToTop, visibleSpaceToTop) <=
            visibleSpaceToTop &&
          Math.max(minWidth ?? visibleSpaceToLeft, visibleSpaceToLeft) <=
            visibleSpaceToLeft,
        top: top - height,
        left: left - width,
        height,
        width,
        minWidth: Math.max(minWidth ?? width, width),
        minHeight: Math.max(minHeight ?? height, height),
      };
    }
    case Placement.bottomCenter: {
      // we want an anchor to be in the center of the bottom edge of an element
      const halfEdge = elementWidth / 2;
      const width =
        Math.min(anchor.left, viewport.width - anchor.left, halfEdge) * 2;
      const height = Math.min(anchor.top, elementHeight);

      return {
        matches:
          Math.max(minHeight ?? visibleSpaceToTop, visibleSpaceToTop) <=
            visibleSpaceToTop &&
          Math.max(minWidth ?? visibleSpaceToRight, visibleSpaceToRight) <=
            visibleSpaceToRight &&
          Math.max(minWidth ?? visibleSpaceToLeft, visibleSpaceToLeft) <=
            visibleSpaceToLeft,
        left: left - width / 2,
        top: top - height,
        height,
        width,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.centerCenter: {
      // we want an anchor to be in the vertical and horizontal center of an element
      const halfHeight = elementHeight / 2;
      const halfWidth = elementWidth / 2;
      const height =
        Math.min(anchor.top, viewport.height - anchor.top, halfHeight) * 2;
      const width =
        Math.min(anchor.left, viewport.width - anchor.left, halfWidth) * 2;

      return {
        matches:
          Math.max(minHeight ?? visibleSpaceToTop, visibleSpaceToTop) <=
            visibleSpaceToTop &&
          Math.max(minHeight ?? visibleSpaceToBottom, visibleSpaceToBottom) <=
            visibleSpaceToBottom &&
          Math.max(minWidth ?? visibleSpaceToLeft, visibleSpaceToLeft) <=
            visibleSpaceToLeft &&
          Math.max(minWidth ?? visibleSpaceToRight, visibleSpaceToRight) <=
            visibleSpaceToRight,
        left: left - width / 2,
        top: top - height / 2,
        height,
        width,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.centerLeft: {
      // we want an anchor to be in the vertical center of the left edge of an element
      const halfHeight = elementHeight / 2;
      const width = Math.min(viewport.width - anchor.left, elementWidth);
      const height =
        Math.min(anchor.top, viewport.height - anchor.top, halfHeight) * 2;

      return {
        matches:
          Math.max(minHeight ?? visibleSpaceToTop, visibleSpaceToTop) <=
            visibleSpaceToTop &&
          Math.max(minHeight ?? visibleSpaceToBottom, visibleSpaceToBottom) <=
            visibleSpaceToBottom &&
          Math.max(minWidth ?? visibleSpaceToLeft, visibleSpaceToLeft) <=
            visibleSpaceToLeft &&
          Math.max(minWidth ?? visibleSpaceToRight, visibleSpaceToRight) <=
            visibleSpaceToRight,
        top: top - height / 2,
        left,
        height,
        width,
        minWidth: Math.max(minWidth ?? width, width),
        minHeight: Math.max(minHeight ?? height, height),
      };
    }
    case Placement.centerRight: {
      // we want an anchor to be in the vertical center of the right edge of an element
      const halfHeight = elementHeight / 2;
      const width = Math.min(anchor.left, elementWidth);
      const height =
        Math.min(anchor.top, viewport.height - anchor.top, halfHeight) * 2;

      return {
        matches:
          Math.max(minHeight ?? visibleSpaceToTop, visibleSpaceToTop) <=
            visibleSpaceToTop &&
          Math.max(minHeight ?? visibleSpaceToBottom, visibleSpaceToBottom) <=
            visibleSpaceToBottom &&
          Math.max(minWidth ?? visibleSpaceToLeft, visibleSpaceToLeft) <=
            visibleSpaceToLeft &&
          Math.max(minWidth ?? visibleSpaceToRight, visibleSpaceToRight) <=
            visibleSpaceToRight,
        top: top - height / 2,
        left: left - width,
        height,
        width,
        minWidth: Math.max(minWidth ?? width, width),
        minHeight: Math.max(minHeight ?? height, height),
      };
    }
    default: {
      throw new TypeError(`Invalid Placement type`);
    }
  }
}

interface PlacementConstraints {
  /**
   * Min height required to consider if we can place the element there
   */
  minHeight?: number;
  /**
   * Min width required to consider if we can place the element there
   */
  minWidth?: number;
}

export type PlacementWithAnchorOrigin = [Placement, AnchorOrigin];

interface ComputePositioningStylesOptions extends PlacementConstraints {
  anchor: HTMLElement | AnchorPosition;
  /**
   * Prioritized array of placement and respective anchor origin
   */
  placementAndOrigin: PlacementWithAnchorOrigin[];
}

export function computePositioningStyles(
  viewport: Window,
  element: HTMLElement,
  {
    anchor,
    placementAndOrigin,
    ...constraints
  }: ComputePositioningStylesOptions,
): PositioningStyles {
  const view: Viewport = {
    height: viewport.innerHeight,
    width: viewport.innerWidth,
    scrollX: getWindowScrollX(),
    scrollY: getWindowScrollY(),
    maxHeight: viewport.document.documentElement.scrollHeight,
    maxWidth: viewport.document.documentElement.scrollWidth,
  };
  const anchorPositionAndDimensions = getAnchorPositionAndDimensions(anchor);
  const elementRect = element.getBoundingClientRect();
  const rect: ElementRect = {
    height: elementRect.height,
    width: elementRect.width,
    scrollHeight: element.scrollHeight,
    scrollWidth: element.scrollWidth,
  };
  let intermediateValue: PlacementRegion | undefined;

  // try to compute positions based on placementAndOrigin
  for (const [placement, anchorOrigin] of placementAndOrigin) {
    const anchorPosition = applyAnchorOrigin(
      anchorPositionAndDimensions,
      anchorOrigin,
    );
    intermediateValue = computePositionAndDimensions(
      view,
      anchorPosition,
      rect,
      placement,
      constraints,
    );

    // detect if region matches contstraints and return immediately if it so
    if (intermediateValue.matches) {
      break;
    }
  }

  return intermediateValue
    ? {
        height: intermediateValue.height,
        minHeight: intermediateValue.minHeight,
        minWidth: intermediateValue.minWidth,
        width: intermediateValue.width,
        top: intermediateValue.top,
        left: intermediateValue.left,
      }
    : {
        height: 0,
        minHeight: 0,
        minWidth: 0,
        width: 0,
        left: 0,
        top: 0,
      };
}
