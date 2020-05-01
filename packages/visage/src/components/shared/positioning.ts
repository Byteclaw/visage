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
  // transformOrigin: string;
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
   * Does element overflow visible area after constraints are applied?
   */
  overflows: boolean;
  top: number;
  left: number;
  height: number;
  width: number;
  /** Max top that can be outside of visibe area */
  maxTop: number;
  /** Max left that can be outside of visibe area */
  maxLeft: number;
  /** Max height that can be outside of visibe area */
  maxHeight: number;
  /** Max width that can be outside of visibe area */
  maxWidth: number;
}

export function detectElementViewportOverflow(
  view: Viewport,
  placementRegion: Omit<PlacementRegion, 'overflows'>,
): PlacementRegion {
  if (
    placementRegion.top < view.scrollY ||
    placementRegion.left < view.scrollX
  ) {
    return {
      ...placementRegion,
      overflows: true,
    };
  }

  if (
    placementRegion.left + placementRegion.width >
    view.scrollX + view.width
  ) {
    return {
      ...placementRegion,
      overflows: true,
    };
  }

  if (
    placementRegion.top + placementRegion.height >
    view.scrollY + view.height
  ) {
    return {
      ...placementRegion,
      overflows: true,
    };
  }

  return {
    ...placementRegion,
    overflows: false,
  };
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
    maxHeight: maxHeightC,
    maxWidth: maxWidthC,
    minHeight: minHeightC,
    minWidth: minWidthC,
  }: PlacementConstraints = {},
): PlacementRegion {
  const top = anchor.top + viewport.scrollY;
  const left = anchor.left + viewport.scrollX;
  const elementWidth = Math.max(element.width, element.scrollWidth);
  const elementHeight = Math.max(element.height, element.scrollHeight);

  // now based on placement, compute available region based on anchor position and viewport information
  switch (placement) {
    case Placement.topLeft: {
      // we want an anchor to be in top left corner of an element
      const height = Math.min(viewport.height - anchor.top, elementHeight);
      const width = Math.min(viewport.width - anchor.left, elementWidth);
      const maxWidth = Math.min(viewport.maxWidth - left, elementWidth);
      const maxHeight = Math.min(viewport.maxHeight - top, elementHeight);
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? height, height),
      );
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? width, width),
      );

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        left,
        top,
        maxTop: top,
        maxLeft: left,
        maxHeight,
        maxWidth,
      });
    }
    case Placement.topRight: {
      // we want an anchor to be in top right corner of an element
      const height = Math.min(viewport.height - anchor.top, elementHeight);
      const width = Math.min(anchor.left, elementWidth);
      const maxWidth = Math.min(left, elementWidth);
      const maxHeight = Math.min(viewport.maxHeight - top, elementHeight);
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? height, height),
      );
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? width, width),
      );

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        left: left - widthC,
        top,
        maxTop: top,
        maxLeft: left - maxWidth,
        maxHeight,
        maxWidth,
      });
    }
    case Placement.topCenter: {
      // we want an anchor to be in the center of the top edge of an element
      const height = Math.min(viewport.height - anchor.top, elementHeight);
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? height, height),
      );
      const maxHeight = Math.min(viewport.maxHeight - top, elementHeight);
      const halfEdge = elementWidth / 2;
      const visibleWidth =
        Math.min(anchor.left, viewport.width - anchor.left, halfEdge) * 2;
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? visibleWidth, visibleWidth),
      );
      const maxEdge = Math.min(left, viewport.maxWidth - left, halfEdge);

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        maxWidth: maxEdge * 2,
        maxHeight,
        top,
        maxTop: top,
        left: left - widthC / 2,
        maxLeft: left - maxEdge,
      });
    }
    case Placement.bottomLeft: {
      // we want an anchor to be in the bottom left corner of an element
      const height = Math.min(anchor.top, elementHeight);
      const maxHeight = Math.min(top, elementHeight);
      const width = Math.min(viewport.width - anchor.left, elementWidth);
      const maxWidth = Math.min(viewport.maxWidth - left, elementWidth);
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? height, height),
      );
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? width, width),
      );

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        top: top - heightC,
        left,
        maxLeft: left,
        maxTop: top - maxHeight,
        maxHeight,
        maxWidth,
      });
    }
    case Placement.bottomRight: {
      // we want an anchor to be in the bottom right corner of an element
      const width = Math.min(anchor.left, elementWidth);
      const height = Math.min(anchor.top, elementHeight);
      const maxHeight = Math.min(top, elementHeight);
      const maxWidth = Math.min(left, elementWidth);
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? height, height),
      );
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? width, width),
      );

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        top: top - heightC,
        left: left - widthC,
        maxTop: top - maxHeight,
        maxLeft: left - maxWidth,
        maxWidth,
        maxHeight,
      });
    }
    case Placement.bottomCenter: {
      // we want an anchor to be in the center of the bottom edge of an element
      const halfEdge = elementWidth / 2;
      const visibleWidth =
        Math.min(anchor.left, viewport.width - anchor.left, halfEdge) * 2;
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? visibleWidth, visibleWidth),
      );
      const height = Math.min(anchor.top, elementHeight);
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? height, height),
      );
      const maxHeight = Math.min(top, elementHeight);
      const maxEdge = Math.min(left, viewport.maxWidth - left, halfEdge);

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        top: top - heightC,
        left: left - widthC / 2,
        maxTop: top - maxHeight,
        maxHeight,
        maxWidth: maxEdge * 2,
        maxLeft: left - maxEdge,
      });
    }
    case Placement.centerCenter: {
      // we want an anchor to be in the vertical and horizontal center of an element
      const halfHeight = elementHeight / 2;
      const halfWidth = elementWidth / 2;
      const visibleHeight =
        Math.min(anchor.top, viewport.height - anchor.top, halfHeight) * 2;
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? visibleHeight, visibleHeight),
      );
      const visibleWidth =
        Math.min(anchor.left, viewport.width - anchor.left, halfWidth) * 2;
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? visibleWidth, visibleWidth),
      );
      const maxHeightEdge = Math.min(top, viewport.maxHeight - top, halfHeight);
      const maxWidthEdge = Math.min(left, viewport.maxWidth - left, halfWidth);

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        top: top - heightC / 2,
        left: left - widthC / 2,
        maxHeight: maxHeightEdge * 2,
        maxWidth: maxWidthEdge * 2,
        maxTop: top - maxHeightEdge,
        maxLeft: left - maxWidthEdge,
      });
    }
    case Placement.centerLeft: {
      // we want an anchor to be in the vertical center of the left edge of an element
      const halfHeight = elementHeight / 2;
      const width = Math.min(viewport.width - anchor.left, elementWidth);
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? width, width),
      );
      const maxWidth = Math.min(viewport.maxWidth - left, elementWidth);
      const visibleHeight =
        Math.min(anchor.top, viewport.height - anchor.top, halfHeight) * 2;
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? visibleHeight, visibleHeight),
      );
      const maxHeightEdge = Math.min(top, viewport.maxHeight - top, halfHeight);

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        top: top - heightC / 2,
        left,
        maxHeight: maxHeightEdge * 2,
        maxWidth,
        maxTop: top - maxHeightEdge,
        maxLeft: left,
      });
    }
    case Placement.centerRight: {
      // we want an anchor to be in the vertical center of the right edge of an element
      const halfHeight = elementHeight / 2;
      const width = Math.min(anchor.left, elementWidth);
      const widthC = Math.max(
        minWidthC ?? 0,
        Math.min(maxWidthC ?? width, width),
      );
      const maxWidth = Math.min(left, elementWidth);
      const visibleHeight =
        Math.min(anchor.top, viewport.height - anchor.top, halfHeight) * 2;
      const heightC = Math.max(
        minHeightC ?? 0,
        Math.min(maxHeightC ?? visibleHeight, visibleHeight),
      );
      const maxHeightEdge = Math.min(top, viewport.maxHeight - top, halfHeight);

      return detectElementViewportOverflow(viewport, {
        height: heightC,
        width: widthC,
        top: top - heightC / 2,
        left: left - widthC,
        maxHeight: maxHeightEdge * 2,
        maxWidth,
        maxTop: top - maxHeightEdge,
        maxLeft: left - maxWidth,
      });
    }
    default: {
      throw new TypeError(`Invalid Placement type`);
    }
  }
}

interface PlacementConstraints {
  /**
   * Max height for an element, if provided given element will never have height higher than maxHeight
   */
  maxHeight?: number;
  /**
   * Max width for an element, if provided given element will never have width longer than maxWidth
   */
  maxWidth?: number;
  /**
   * Min height for an element, if provided it will try to find placement where height is higher or equal to the provided value
   */
  minHeight?: number;
  /**
   * Min width for an element, if provided it will try to find placement where width is longer or equal to the provided value
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

    // detect if region overflows, if yes, continue matching
    // otherwise we found nice place to place our element so use it
    // immediately
    if (!intermediateValue.overflows) {
      break;
    }
  }

  return intermediateValue
    ? {
        height: intermediateValue.height,
        width: intermediateValue.width,
        top: intermediateValue.top,
        left: intermediateValue.left,
      }
    : {
        height: 0,
        width: 0,
        left: 0,
        top: 0,
      };
}
