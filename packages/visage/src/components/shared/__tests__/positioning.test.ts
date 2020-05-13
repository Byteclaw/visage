import {
  getOffsetLeft,
  getOffsetTop,
  computePositionAndDimensions,
  computePositioningStyles,
  Placement,
  PlacementViewport,
  ElementRect,
} from '../positioning';

describe('positioning', () => {
  const rect = {
    bottom: 0,
    height: 40,
    left: 0,
    right: 0,
    top: 0,
    width: 120,
  };

  const anchorOriginBottomLeft = { vertical: 'bottom', horizontal: 'left' };
  const anchorOriginTopLeft = { vertical: 'top', horizontal: 'left' };
  const anchorOriginCenterLeft = { vertical: 'center', horizontal: 'left' };
  const anchorOriginTopRight = { vertical: 'top', horizontal: 'right' };
  const anchorOriginCenterCenter = { vertical: 'center', horizontal: 'center' };

  describe('getOffsetTop()', () => {
    it('calculates the top offset correctly', () => {
      expect(getOffsetTop(rect, anchorOriginBottomLeft.vertical as any)).toBe(
        40,
      );
      expect(getOffsetTop(rect, anchorOriginTopLeft.vertical as any)).toBe(0);
      expect(getOffsetTop(rect, anchorOriginCenterLeft.vertical as any)).toBe(
        20,
      );
      expect(getOffsetTop(rect, anchorOriginTopRight.vertical as any)).toBe(0);
    });
  });

  describe('getOffsetLeft()', () => {
    it('calculates the left offset correctly', () => {
      expect(
        getOffsetLeft(rect, anchorOriginBottomLeft.horizontal as any),
      ).toBe(0);
      expect(getOffsetLeft(rect, anchorOriginTopLeft.horizontal as any)).toBe(
        0,
      );
      expect(
        getOffsetLeft(rect, anchorOriginCenterLeft.horizontal as any),
      ).toBe(0);
      expect(getOffsetLeft(rect, anchorOriginTopRight.horizontal as any)).toBe(
        120,
      );
      expect(
        getOffsetLeft(rect, anchorOriginCenterCenter.horizontal as any),
      ).toBe(60);
    });
  });

  describe('computePositionAndDimensions()', () => {
    const viewport: PlacementViewport = {
      height: 100,
      maxHeight: 120,
      maxWidth: 120,
      width: 100,
      scrollY: 10,
      scrollX: 10,
    };
    const element: ElementRect = {
      height: 100,
      scrollHeight: 100,
      scrollWidth: 100,
      width: 100,
    };

    it('computes available space and dimensions (top-left)', () => {
      // top left edge anchor
      expect(
        computePositionAndDimensions(
          viewport,
          { left: 0, top: 0 },
          element,
          Placement.topLeft,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        height: 100,
        width: 100,
        minHeight: 100,
        minWidth: 100,
      });

      // any element that has width or height 0 is not matched
      expect(
        computePositionAndDimensions(
          viewport,
          { left: 0, top: 0 },
          { height: 16, scrollHeight: 16, width: 0, scrollWidth: 1 },
          Placement.topLeft,
          { minHeight: 150 },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        height: 16,
        width: 0,
        minHeight: 150,
        minWidth: 0,
      });

      // top right edge anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.topLeft,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 110,
        width: 0,
        height: 100,
        minHeight: 100,
        minWidth: 0,
      });

      // bottom right edge anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.topLeft,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 110,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // bottom left edge anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.topLeft,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 10,
        width: 100,
        height: 0,
        minHeight: 0,
        minWidth: 100,
      });

      // anchor somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topLeft,
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        minHeight: 80,
        minWidth: 80,
      });
    });

    it('computes available space and dimensions (top-left) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topLeft,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 30,
        width: 70,
        height: 70,
        minWidth: 70,
        minHeight: 70,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 90,
            top: 10,
          },
          element,
          Placement.topLeft,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: false,
        top: 20,
        left: 100,
        width: 0,
        height: 80,
        minWidth: 0,
        minHeight: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 80,
            top: 20,
          },
          element,
          Placement.topLeft,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 90,
        width: 10,
        height: 70,
        minWidth: 10,
        minHeight: 70,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 80,
            top: 0,
          },
          element,
          Placement.topLeft,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 90,
        width: 10,
        height: 90,
        minWidth: 10,
        minHeight: 90,
      });
    });

    it('computes available space and dimensions (top-left) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topLeft,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        minWidth: 110,
        minHeight: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topLeft,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        minWidth: 100,
        minHeight: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topLeft,
          {
            minWidth: 80,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        minWidth: 80,
        minHeight: 80,
      });
    });

    it('computes available space and dimensions (top-left) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topLeft,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        minHeight: 110,
        minWidth: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topLeft,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        minHeight: 100,
        minWidth: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topLeft,
          {
            minHeight: 80,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        minHeight: 80,
        minWidth: 80,
      });
    });

    it('computes available space and dimensions (top-right)', () => {
      // top left corner
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 0,
          },
          element,
          Placement.topRight,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 0,
        height: 100,
        minWidth: 0,
        minHeight: 100,
      });

      // top right corner
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.topRight,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 100,
        height: 100,
        minWidth: 100,
        minHeight: 100,
      });

      // bottom left
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.topRight,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 10,
        width: 0,
        height: 0,
        minWidth: 0,
        minHeight: 0,
      });

      // bottom right
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.topRight,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 10,
        width: 100,
        height: 0,
        minWidth: 100,
        minHeight: 0,
      });

      // somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topRight,
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minWidth: 20,
        minHeight: 80,
      });
    });

    it('computes available space and dimensions (top-right) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topRight,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 20,
        width: 10,
        height: 70,
        minWidth: 10,
        minHeight: 70,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 10,
            top: 20,
          },
          element,
          Placement.topRight,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 20,
        width: 0,
        height: 70,
        minWidth: 0,
        minHeight: 70,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 5,
          },
          element,
          Placement.topRight,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: false,
        top: 15,
        left: 20,
        width: 10,
        height: 85,
        minWidth: 10,
        minHeight: 85,
      });
    });

    it('computes available space and dimensions (top-right) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topRight,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minWidth: 110,
        minHeight: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topRight,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minWidth: 100,
        minHeight: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topRight,
          {
            minWidth: 20,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minWidth: 20,
        minHeight: 80,
      });
    });

    it('computes available space and dimensions (top-right) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topRight,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minHeight: 110,
        minWidth: 20,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topRight,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minHeight: 100,
        minWidth: 20,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topRight,
          {
            minHeight: 80,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minHeight: 80,
        minWidth: 20,
      });
    });

    it('computes available space and dimensions (top-center)', () => {
      // somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topCenter,
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 10,
        width: 40,
        height: 80,
        minHeight: 80,
        minWidth: 40,
      });

      // top left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 0,
          },
          element,
          Placement.topCenter,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 0,
        height: 100,
        minHeight: 100,
        minWidth: 0,
      });

      // top right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.topCenter,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 110,
        width: 0,
        height: 100,
        minHeight: 100,
        minWidth: 0,
      });

      // bottom left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.topCenter,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 10,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // bottom right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.topCenter,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 110,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });
    });

    it('computes available space and dimensions (top-center) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topCenter,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 20,
        width: 20,
        height: 70,
        minHeight: 70,
        minWidth: 20,
      });
    });

    it('computes available space and dimensions (top-center) - minHeight', () => {
      // min height is taken into consideration if shorter or equal to elements height
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topCenter,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 10,
        width: 40,
        height: 80,
        minHeight: 100,
        minWidth: 40,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topCenter,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 10,
        width: 40,
        height: 80,
        minHeight: 110,
        minWidth: 40,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topCenter,
          {
            minHeight: 80,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 10,
        width: 40,
        height: 80,
        minHeight: 80,
        minWidth: 40,
      });
    });

    it('computes available space and dimensions (top-center) - minWidth', () => {
      // min width is taken into consideration if shorter or equal to elements width
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topCenter,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 10,
        width: 40,
        height: 80,
        minWidth: 100,
        minHeight: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topCenter,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 30,
        left: 10,
        width: 40,
        height: 80,
        minWidth: 110,
        minHeight: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.topCenter,
          {
            minWidth: 40,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 10,
        width: 40,
        height: 80,
        minWidth: 40,
        minHeight: 80,
      });
    });

    it('computes available space and dimensions (bottom-left)', () => {
      // somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomLeft,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        minHeight: 20,
        minWidth: 80,
      });

      // top left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 0,
          },
          element,
          Placement.bottomLeft,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 100,
        height: 0,
        minHeight: 0,
        minWidth: 100,
      });

      // top right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.bottomLeft,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 110,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // bottom left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.bottomLeft,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 100,
        height: 100,
        minHeight: 100,
        minWidth: 100,
      });

      // bottom right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.bottomLeft,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 110,
        width: 0,
        height: 100,
        minHeight: 100,
        minWidth: 0,
      });
    });

    it('computes available space and dimensions (bottom-left) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomLeft,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 20,
        left: 30,
        width: 70,
        height: 10,
        minHeight: 10,
        minWidth: 70,
      });
    });

    it('computes available space and dimensions (bottom-left) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomLeft,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        minHeight: 100,
        minWidth: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomLeft,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        minHeight: 110,
        minWidth: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomLeft,
          {
            minHeight: 20,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        minHeight: 20,
        minWidth: 80,
      });
    });

    it('computes available space and dimensions (bottom-left) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomLeft,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        minWidth: 100,
        minHeight: 20,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomLeft,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        minWidth: 110,
        minHeight: 20,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomLeft,
          {
            minWidth: 80,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        minWidth: 80,
        minHeight: 20,
      });
    });

    it('computes available space and dimensions (bottom-right)', () => {
      // somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomRight,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minWidth: 20,
        minHeight: 20,
      });

      // top left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 0,
          },
          element,
          Placement.bottomRight,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 0,
        height: 0,
        minWidth: 0,
        minHeight: 0,
      });

      // top right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.bottomRight,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 100,
        height: 0,
        minWidth: 100,
        minHeight: 0,
      });

      // bottom left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.bottomRight,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 0,
        height: 100,
        minWidth: 0,
        minHeight: 100,
      });

      // bottom right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.bottomRight,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 100,
        height: 100,
        minWidth: 100,
        minHeight: 100,
      });
    });

    it('computes available space and dimensions (bottom-right) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomRight,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 20,
        left: 20,
        width: 10,
        height: 10,
        minWidth: 10,
        minHeight: 10,
      });
    });

    it('computes available space and dimensions (bottom-right) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomRight,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minHeight: 100,
        minWidth: 20,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomRight,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minHeight: 110,
        minWidth: 20,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomRight,
          {
            minHeight: 20,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minHeight: 20,
        minWidth: 20,
      });
    });

    it('computes available space and dimensions (bottom-right) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomRight,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minHeight: 20,
        minWidth: 100,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomRight,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minHeight: 20,
        minWidth: 110,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomRight,
          {
            minWidth: 20,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minHeight: 20,
        minWidth: 20,
      });
    });

    it('computes available space and dimensions (bottom-center)', () => {
      // somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomCenter,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        minHeight: 20,
        minWidth: 40,
      });

      // top left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 0,
          },
          element,
          Placement.bottomCenter,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // top right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.bottomCenter,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 110,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // bottom left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.bottomCenter,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 0,
        height: 100,
        minHeight: 100,
        minWidth: 0,
      });

      // bottom right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.bottomCenter,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 110,
        width: 0,
        height: 100,
        minHeight: 100,
        minWidth: 0,
      });
    });

    it('computes available space and dimensions (bottom-center) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomCenter,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 20,
        left: 20,
        width: 20,
        height: 10,
        minHeight: 10,
        minWidth: 20,
      });
    });

    it('computes available space and dimensions (bottom-center) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomCenter,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        minHeight: 100,
        minWidth: 40,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomCenter,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        minHeight: 110,
        minWidth: 40,
      });
    });

    it('computes available space and dimensions (bottom-center) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomCenter,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        minHeight: 20,
        minWidth: 100,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomCenter,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        minHeight: 20,
        minWidth: 110,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.bottomCenter,
          {
            minWidth: 40,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        minHeight: 20,
        minWidth: 40,
      });
    });

    it('computes available space and dimensions (center-left)', () => {
      // somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerLeft,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        minHeight: 40,
        minWidth: 80,
      });

      // top left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 0,
          },
          element,
          Placement.centerLeft,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 100,
        height: 0,
        minHeight: 0,
        minWidth: 100,
      });

      // top right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.centerLeft,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 110,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // bottom left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.centerLeft,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 10,
        width: 100,
        height: 0,
        minHeight: 0,
        minWidth: 100,
      });

      // bottom right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.centerLeft,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 110,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });
    });

    it('computes available space and dimensions (center-left) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerLeft,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 20,
        left: 30,
        width: 70,
        height: 20,
        minHeight: 20,
        minWidth: 70,
      });
    });

    it('computes available space and dimensions (center-left) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerLeft,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        minHeight: 100,
        minWidth: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerLeft,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        minHeight: 110,
        minWidth: 80,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerLeft,
          {
            minHeight: 40,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        minHeight: 40,
        minWidth: 80,
      });
    });

    it('computes available space and dimensions (center-left) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerLeft,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        minHeight: 40,
        minWidth: 110,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerLeft,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        minHeight: 40,
        minWidth: 100,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerLeft,
          {
            minWidth: 80,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        minHeight: 40,
        minWidth: 80,
      });
    });

    it('computes available space and dimensions (center-right)', () => {
      // somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerRight,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minHeight: 40,
        minWidth: 20,
      });

      // top left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 0,
          },
          element,
          Placement.centerRight,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // top right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.centerRight,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 100,
        height: 0,
        minHeight: 0,
        minWidth: 100,
      });

      // bottom left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.centerRight,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 10,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // bottom right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.centerRight,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 10,
        width: 100,
        height: 0,
        minHeight: 0,
        minWidth: 100,
      });
    });

    it('computes available space and dimensions (center-right) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerRight,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 20,
        left: 20,
        width: 10,
        height: 20,
        minHeight: 20,
        minWidth: 10,
      });
    });

    it('computes available space and dimensions (center-right) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerRight,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minWidth: 20,
        minHeight: 110,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerRight,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minWidth: 20,
        minHeight: 100,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerRight,
          {
            minHeight: 40,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minWidth: 20,
        minHeight: 40,
      });
    });

    it('computes available space and dimensions (center-right) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerRight,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minWidth: 110,
        minHeight: 40,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerRight,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minWidth: 100,
        minHeight: 40,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerRight,
          {
            minWidth: 20,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minWidth: 20,
        minHeight: 40,
      });
    });

    it('computes available space and dimensions (center-center)', () => {
      // somewhere in the viewport
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerCenter,
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 40,
        minWidth: 40,
      });

      // top left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 0,
          },
          element,
          Placement.centerCenter,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // top right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 0,
          },
          element,
          Placement.centerCenter,
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 110,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // bottom left anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 0,
            top: 100,
          },
          element,
          Placement.centerCenter,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 10,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });

      // bottom right anchor
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 100,
            top: 100,
          },
          element,
          Placement.centerCenter,
        ),
      ).toEqual({
        matches: false,
        top: 110,
        left: 110,
        width: 0,
        height: 0,
        minHeight: 0,
        minWidth: 0,
      });
    });

    it('computes available space and dimensions (center-center) - marginThreshold', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerCenter,
          {
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        matches: true,
        top: 20,
        left: 20,
        width: 20,
        height: 20,
        minHeight: 20,
        minWidth: 20,
      });
    });

    it('computes available space and dimensions (center-center) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerCenter,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 110,
        minWidth: 40,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerCenter,
          {
            minHeight: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 100,
        minWidth: 40,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerCenter,
          {
            minHeight: 40,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 40,
        minWidth: 40,
      });
    });

    it('computes available space and dimensions (center-center) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerCenter,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 40,
        minWidth: 110,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerCenter,
          {
            minWidth: 100,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 40,
        minWidth: 100,
      });

      expect(
        computePositionAndDimensions(
          viewport,
          {
            left: 20,
            top: 20,
          },
          element,
          Placement.centerCenter,
          {
            minWidth: 40,
          },
        ),
      ).toEqual({
        matches: true,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 40,
        minWidth: 40,
      });
    });
  });

  describe('computePositioningStyles', () => {
    it('returns first matched placement', () => {
      const window = {
        innerHeight: 100,
        innerWidth: 100,
        scrollX: 0,
        scrollY: 0,
        document: {
          documentElement: {
            scrollHeight: 100,
            scrollWidth: 100,
          },
        },
      };
      const element = {
        getBoundingClientRect() {
          return {
            height: 100,
            width: 100,
          };
        },
        scrollWidth: 100,
        offsetWidth: 100,
      };

      expect(
        computePositioningStyles(window as any, element as any, {
          anchor: { top: 20, left: 20 },
          placementAndOrigin: [
            {
              placement: Placement.topLeft,
              horizontal: 'left',
              vertical: 'bottom',
            },
            {
              placement: Placement.bottomLeft,
              horizontal: 'left',
              vertical: 'top',
            },
          ],
        }),
      ).toEqual({
        placement: Placement.topLeft,
        matches: true,
        top: 20,
        left: 20,
        width: 80,
        height: 80,
        minHeight: 80,
        minWidth: 80,
      });

      expect(
        computePositioningStyles(window as any, element as any, {
          anchor: { top: 100, left: 20 },
          placementAndOrigin: [
            {
              placement: Placement.topLeft,
              horizontal: 'left',
              vertical: 'bottom',
            },
            {
              placement: Placement.bottomLeft,
              horizontal: 'left',
              vertical: 'top',
            },
          ],
        }),
      ).toEqual({
        placement: Placement.bottomLeft,
        matches: true,
        top: 0,
        left: 20,
        width: 80,
        height: 100,
        minHeight: 100,
        minWidth: 80,
      });
    });

    it('returns best possible placement if not matched', () => {
      const window = {
        innerHeight: 100,
        innerWidth: 100,
        scrollX: 0,
        scrollY: 0,
        document: {
          documentElement: {
            scrollHeight: 100,
            scrollWidth: 100,
          },
        },
      };
      const element = {
        getBoundingClientRect() {
          return {
            height: 100,
            width: 100,
          };
        },
        scrollWidth: 100,
        offsetWidth: 100,
      };

      expect(
        computePositioningStyles(window as any, element as any, {
          anchor: { top: 20, left: 20 },
          placementAndOrigin: [
            {
              placement: Placement.topLeft,
              horizontal: 'left',
              vertical: 'bottom',
            },
            {
              placement: Placement.bottomLeft,
              horizontal: 'left',
              vertical: 'top',
            },
          ],
          minHeight: 30,
          marginThreshold: 10,
        }),
      ).toEqual({
        matches: true,
        placement: Placement.topLeft,
        top: 20,
        left: 20,
        width: 70,
        height: 70,
        minHeight: 70,
        minWidth: 70,
      });

      // this element has no width, so it should be rendered on first best unmatched position
      expect(
        computePositioningStyles(
          window as any,
          {
            getBoundingClientRect() {
              return {
                height: 100,
                width: 0,
              };
            },
            scrollHeight: 100,
            scrollWidth: 1,
          } as any,
          {
            anchor: { top: 20, left: 20 },
            placementAndOrigin: [
              {
                placement: Placement.topLeft,
                horizontal: 'left',
                vertical: 'bottom',
              },
              {
                placement: Placement.bottomLeft,
                horizontal: 'left',
                vertical: 'top',
              },
            ],
            minHeight: 30,
            marginThreshold: 10,
          },
        ),
      ).toEqual({
        placement: Placement.topLeft,
        matches: false,
        top: 20,
        left: 20,
        width: 0,
        height: 70,
        minHeight: 70,
        minWidth: 0,
      });
    });
  });
});
