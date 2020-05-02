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
  /**
   * Maximum height of the element that can be occupied.
   */
  height: number;
  minHeight: number;
  minWidth: number;
  top: number;
  /**
   * Maximum width of the element that can be occupied.
   */
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

export interface PlacementViewport {
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

export interface PlacementRegion {
  /**
   * Does placement region match specified constraint or can it be even rendered?
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
  viewport: PlacementViewport,
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
  { marginThreshold = 0, minHeight, minWidth }: PlacementConstraints = {},
): PlacementRegion {
  const top = anchor.top + viewport.scrollY;
  const left = anchor.left + viewport.scrollX;
  const topMarginThreshold = viewport.scrollY + marginThreshold;
  const leftMarginThreshold = viewport.scrollX + marginThreshold;
  const elementWidth = element.width;
  const elementHeight = element.height;

  // now based on placement, compute available region based on anchor position and viewport information
  switch (placement) {
    case Placement.topLeft: {
      // we want an anchor to be in top left corner of an element
      const height = Math.max(
        Math.min(viewport.height - marginThreshold - anchor.top, elementHeight),
        0,
      );
      const width = Math.max(
        Math.min(viewport.width - marginThreshold - anchor.left, elementWidth),
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);

      return {
        matches:
          width > 0 &&
          height > 0 &&
          mHeight <= height &&
          mWidth <= width &&
          top >= topMarginThreshold &&
          left >= leftMarginThreshold,
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
      const height = Math.max(
        Math.min(viewport.height - marginThreshold - anchor.top, elementHeight),
        0,
      );
      const width = Math.max(
        Math.min(anchor.left - marginThreshold, elementWidth),
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);
      const x = left - width;

      return {
        matches:
          width > 0 &&
          height > 0 &&
          mHeight <= height &&
          mWidth <= width &&
          top >= topMarginThreshold &&
          x >= leftMarginThreshold,
        height,
        width,
        top,
        left: x,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.topCenter: {
      // we want an anchor to be in the center of the top edge of an element
      const height = Math.max(
        Math.min(viewport.height - marginThreshold - anchor.top, elementHeight),
        0,
      );
      const halfEdge = elementWidth / 2;
      const width = Math.max(
        Math.min(
          anchor.left - marginThreshold,
          viewport.width - marginThreshold - anchor.left,
          halfEdge,
        ) * 2,
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);
      const x = left - width / 2;

      return {
        matches:
          height > 0 &&
          width > 0 &&
          mHeight <= height &&
          mWidth <= width &&
          top >= topMarginThreshold &&
          x >= leftMarginThreshold,
        height,
        width,
        left: x,
        top,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.bottomLeft: {
      // we want an anchor to be in the bottom left corner of an element
      const height = Math.max(
        Math.min(anchor.top - marginThreshold, elementHeight),
        0,
      );
      const width = Math.max(
        Math.min(viewport.width - marginThreshold - anchor.left, elementWidth),
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);
      const y = top - height;

      return {
        matches:
          height > 0 &&
          width > 0 &&
          mHeight <= height &&
          mWidth <= width &&
          y >= topMarginThreshold &&
          left >= leftMarginThreshold,
        left,
        top: y,
        height,
        width,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.bottomRight: {
      // we want an anchor to be in the bottom right corner of an element
      const width = Math.max(
        Math.min(anchor.left - marginThreshold, elementWidth),
        0,
      );
      const height = Math.max(
        Math.min(anchor.top - marginThreshold, elementHeight),
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);
      const x = left - width;
      const y = top - height;

      return {
        matches:
          height > 0 &&
          width > 0 &&
          mHeight <= height &&
          mWidth <= width &&
          x >= leftMarginThreshold &&
          y >= topMarginThreshold,
        top: y,
        left: x,
        height,
        width,
        minWidth: Math.max(minWidth ?? width, width),
        minHeight: Math.max(minHeight ?? height, height),
      };
    }
    case Placement.bottomCenter: {
      // we want an anchor to be in the center of the bottom edge of an element
      const halfEdge = elementWidth / 2;
      const width = Math.max(
        Math.min(
          anchor.left - marginThreshold,
          viewport.width - marginThreshold - anchor.left,
          halfEdge,
        ) * 2,
        0,
      );
      const height = Math.max(
        Math.min(anchor.top - marginThreshold, elementHeight),
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);
      const x = left - width / 2;
      const y = top - height;

      return {
        matches:
          height > 0 &&
          width > 0 &&
          mWidth <= width &&
          mHeight <= height &&
          x >= leftMarginThreshold &&
          y >= topMarginThreshold,
        left: x,
        top: y,
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
      const height = Math.max(
        Math.min(
          anchor.top - marginThreshold,
          viewport.height - marginThreshold - anchor.top,
          halfHeight,
        ) * 2,
        0,
      );
      const width = Math.max(
        Math.min(
          anchor.left - marginThreshold,
          viewport.width - marginThreshold - anchor.left,
          halfWidth,
        ) * 2,
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);
      const x = left - width / 2;
      const y = top - height / 2;

      return {
        matches:
          height > 0 &&
          width > 0 &&
          mWidth <= width &&
          mHeight <= height &&
          x >= leftMarginThreshold &&
          y >= topMarginThreshold,
        left: x,
        top: y,
        height,
        width,
        minHeight: Math.max(minHeight ?? height, height),
        minWidth: Math.max(minWidth ?? width, width),
      };
    }
    case Placement.centerLeft: {
      // we want an anchor to be in the vertical center of the left edge of an element
      const halfHeight = elementHeight / 2;
      const width = Math.max(
        Math.min(viewport.width - marginThreshold - anchor.left, elementWidth),
        0,
      );
      const height = Math.max(
        Math.min(
          anchor.top - marginThreshold,
          viewport.height - marginThreshold - anchor.top,
          halfHeight,
        ) * 2,
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);
      const y = top - height / 2;

      return {
        matches:
          height > 0 &&
          width > 0 &&
          mHeight <= height &&
          mWidth <= width &&
          y >= topMarginThreshold &&
          left >= leftMarginThreshold,
        top: y,
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
      const width = Math.max(
        Math.min(anchor.left - marginThreshold, elementWidth),
        0,
      );
      const height = Math.max(
        Math.min(
          anchor.top - marginThreshold,
          viewport.height - marginThreshold - anchor.top,
          halfHeight,
        ) * 2,
        0,
      );
      const mHeight = Math.min(minHeight ?? 0, elementHeight);
      const mWidth = Math.min(minWidth ?? 0, elementWidth);
      const y = top - height / 2;
      const x = left - width;

      return {
        matches:
          height > 0 &&
          width > 0 &&
          mHeight <= height &&
          mWidth <= width &&
          y >= topMarginThreshold &&
          x >= leftMarginThreshold,
        top: y,
        left: x,
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
   * How much empty space from edges should be left?
   */
  marginThreshold?: number;
  /**
   * Minimal height required by an element to consider a placement as matched.
   *
   * Minimum height is taken into consideration only if the element's height
   * is higher than minHeight.
   */
  minHeight?: number;
  /**
   * Minimal width required by an element to consider a placement as matched.
   *
   * Minimum width is taken into consideration only if the element's width
   * is longer than minWidth
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

/**
 * Computes positioning styles for an element
 *
 * Algorithm tries to match placements and their respective origins in the order
 * they were specified.
 *
 * If placement matches constraints (minHeight, minWidth) then it is used.
 *
 * Constraints don't have anything to do with styles, they're just required minimum dimensions
 * that needs to be available in a given placement region to consider it as matched.
 *
 * Min height constraint is used only if height of an element is higher or equal to it, othwerise
 * it uses the element height. Same rules apply to min width constraints too.
 *
 * Computed width and height should be considered as maxWidth and maxHeight in css. So it is possible
 * for a developer to limit them in CSS.
 */
export function computePositioningStyles(
  viewport: Window,
  element: HTMLElement,
  {
    anchor,
    placementAndOrigin,
    ...constraints
  }: ComputePositioningStylesOptions,
): PositioningStyles {
  const view: PlacementViewport = {
    height: viewport.innerHeight,
    width: viewport.innerWidth,
    scrollX: getWindowScrollX(),
    scrollY: getWindowScrollY(),
    maxHeight: viewport.document.documentElement.scrollHeight,
    maxWidth: viewport.document.documentElement.scrollWidth,
  };
  const anchorPositionAndDimensions = getAnchorPositionAndDimensions(anchor);
  const rect: ElementRect = {
    height: element.offsetHeight,
    width: element.offsetWidth,
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
