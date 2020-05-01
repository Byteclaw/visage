import {
  getOffsetLeft,
  getOffsetTop,
  computePositionAndDimensions,
  Placement,
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
    it('computes available space and dimensions (top-left)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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

    it('computes available space and dimensions, takes scroll into consideration if different (top-left)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 120,
            scrollWidth: 120,
          },
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

    it('computes available space and dimensions (top-left) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (top-left) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (top-right)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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

    it('computes available space and dimensions (top-right) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.topRight,
          {
            minWidth: 110,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minWidth: 110,
        minHeight: 80,
      });
    });

    it('computes available space and dimensions (top-right) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.topRight,
          {
            minHeight: 110,
          },
        ),
      ).toEqual({
        matches: true,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        minHeight: 110,
        minWidth: 20,
      });
    });

    it('computes available space and dimensions (top-center)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (top-center) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (top-center) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (bottom-left)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (bottom-left) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.bottomLeft,
          {
            minHeight: 30,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        minHeight: 30,
        minWidth: 80,
      });
    });

    it('computes available space and dimensions (bottom-left) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (bottom-right)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (bottom-right) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.bottomRight,
          {
            minHeight: 40,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minHeight: 40,
        minWidth: 20,
      });
    });

    it('computes available space and dimensions (bottom-right) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.bottomRight,
          {
            minWidth: 31,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        minHeight: 20,
        minWidth: 31,
      });
    });

    it('computes available space and dimensions (bottom-center)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (bottom-center) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.bottomCenter,
          {
            minHeight: 31,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        minHeight: 31,
        minWidth: 40,
      });
    });

    it('computes available space and dimensions (bottom-center) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.bottomCenter,
          {
            minWidth: 62,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        minHeight: 20,
        minWidth: 62,
      });
    });

    it('computes available space and dimensions (center-left)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (center-left) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (center-left) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.centerLeft,
          {
            minWidth: 200,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        minHeight: 40,
        minWidth: 200,
      });
    });

    it('computes available space and dimensions (center-right)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (center-right) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.centerRight,
          {
            minHeight: 62,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minWidth: 20,
        minHeight: 62,
      });
    });

    it('computes available space and dimensions (center-right) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.centerRight,
          {
            minWidth: 31,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        minWidth: 31,
        minHeight: 40,
      });
    });

    it('computes available space and dimensions (center-center)', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
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
    });

    it('computes available space and dimensions (center-center) - minHeight', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.centerCenter,
          {
            minHeight: 200,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 200,
        minWidth: 40,
      });
    });

    it('computes available space and dimensions (center-center) - minWidth', () => {
      expect(
        computePositionAndDimensions(
          {
            height: 100,
            width: 100,
            scrollY: 10,
            scrollX: 10,
            maxHeight: 120,
            maxWidth: 120,
          },
          {
            left: 20,
            top: 20,
          },
          {
            height: 100,
            width: 100,
            scrollHeight: 100,
            scrollWidth: 100,
          },
          Placement.centerCenter,
          {
            minWidth: 200,
          },
        ),
      ).toEqual({
        matches: false,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        minHeight: 40,
        minWidth: 200,
      });
    });
  });
});
