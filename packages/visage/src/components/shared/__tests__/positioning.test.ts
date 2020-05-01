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
        overflows: false,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
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
        overflows: false,
        top: 30,
        left: 30,
        width: 80,
        height: 80,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
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
        overflows: true,
        top: 30,
        left: 30,
        width: 110,
        height: 80,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
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
        overflows: true,
        top: 30,
        left: 30,
        width: 80,
        height: 110,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
      });
    });

    it('computes available space and dimensions (top-left) - maxWidth', () => {
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
            maxWidth: 40,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 30,
        width: 40,
        height: 80,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
      });
    });

    it('computes available space and dimensions (top-left) - maxHeight', () => {
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
            maxHeight: 40,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 30,
        width: 80,
        height: 40,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
      });
    });

    it('computes available space and dimensions (top-left) - minWidth > maxWidth', () => {
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
            minWidth: 50,
            maxWidth: 40,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 30,
        width: 50,
        height: 80,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
      });
    });

    it('computes available space and dimensions (top-left) - minWidth = maxWidth', () => {
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
            minWidth: 50,
            maxWidth: 50,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 30,
        width: 50,
        height: 80,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
      });
    });

    it('computes available space and dimensions (top-left) - minHeight > maxHeight', () => {
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
            minHeight: 50,
            maxHeight: 40,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 30,
        width: 80,
        height: 50,
        maxTop: 30,
        maxLeft: 30,
        maxHeight: 90,
        maxWidth: 90,
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
        overflows: false,
        top: 30,
        left: 10,
        width: 20,
        height: 80,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 90,
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
        overflows: true,
        top: 30,
        left: -80,
        width: 110,
        height: 80,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 90,
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
        overflows: true,
        top: 30,
        left: 10,
        width: 20,
        height: 110,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 90,
      });
    });

    it('computes available space and dimensions (top-right) - maxWidth', () => {
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
            maxWidth: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 20,
        width: 10,
        height: 80,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 90,
      });
    });

    it('computes available space and dimensions (top-right) - maxHeight', () => {
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
            maxHeight: 40,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 10,
        width: 20,
        height: 40,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 90,
      });
    });

    it('computes available space and dimensions (top-right) - minWidth > maxWidth', () => {
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
            maxWidth: 100,
          },
        ),
      ).toEqual({
        overflows: true,
        top: 30,
        left: -80,
        width: 110,
        height: 80,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 90,
      });
    });

    it('computes available space and dimensions (top-right) - minHeight > maxHeight', () => {
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
            maxHeight: 100,
          },
        ),
      ).toEqual({
        overflows: true,
        top: 30,
        left: 10,
        width: 20,
        height: 110,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 90,
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
            // relative to viewport without scroll
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
        overflows: false,
        top: 30,
        left: 10,
        width: 40,
        height: 80,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 90,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: 30,
        left: 10,
        width: 40,
        height: 100,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 90,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: 30,
        left: -20,
        width: 100,
        height: 80,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 90,
      });
    });

    it('computes available space and dimensions (top-center) - maxHeight', () => {
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
            // relative to viewport without scroll
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
            maxHeight: 40,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 10,
        width: 40,
        height: 40,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 90,
      });
    });

    it('computes available space and dimensions (top-center) - maxWidth', () => {
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
            // relative to viewport without scroll
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
            maxWidth: 30,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 15,
        width: 30,
        height: 80,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 90,
      });
    });

    it('computes available space and dimensions (top-center) - minHeight > maxHeight', () => {
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
            // relative to viewport without scroll
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
            minHeight: 50,
            maxHeight: 40,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 30,
        left: 10,
        width: 40,
        height: 50,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 90,
      });
    });

    it('computes available space and dimensions (top-center) - minWidth > maxWidth', () => {
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
            // relative to viewport without scroll
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
            minWidth: 50,
            maxWidth: 40,
          },
        ),
      ).toEqual({
        overflows: true,
        top: 30,
        left: 5,
        width: 50,
        height: 80,
        maxTop: 30,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 90,
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
            // relative to viewport without scroll
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
        overflows: false,
        top: 10,
        left: 30,
        width: 80,
        height: 20,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
            minHeight: 31,
          },
        ),
      ).toEqual({
        overflows: true,
        top: -1,
        left: 30,
        width: 80,
        height: 31,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-left) - maxHeight', () => {
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
            // relative to viewport without scroll
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
            maxHeight: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 20,
        left: 30,
        width: 80,
        height: 10,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: 10,
        left: 30,
        width: 100,
        height: 20,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-left) - maxWidth', () => {
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
            // relative to viewport without scroll
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
            maxWidth: 60,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 30,
        width: 60,
        height: 20,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-left) - minHeight > maxHeight', () => {
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
            // relative to viewport without scroll
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
            minHeight: 15,
            maxHeight: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 30,
        width: 80,
        height: 15,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-left) - minWidth > maxWidth', () => {
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
            // relative to viewport without scroll
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
            minWidth: 60,
            maxWidth: 50,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 30,
        width: 60,
        height: 20,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
        overflows: false,
        top: 10,
        left: 10,
        width: 20,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: -10,
        left: 10,
        width: 20,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-right) - maxHeight', () => {
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
            // relative to viewport without scroll
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
            maxHeight: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 20,
        left: 10,
        width: 20,
        height: 10,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: 10,
        left: -1,
        width: 31,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-right) - maxWidth', () => {
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
            // relative to viewport without scroll
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
            maxWidth: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 20,
        width: 10,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-right) - minHeight > maxHeight', () => {
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
            // relative to viewport without scroll
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
            minHeight: 15,
            maxHeight: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 10,
        width: 20,
        height: 15,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-right) - minWidth > maxWidth', () => {
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
            // relative to viewport without scroll
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
            minWidth: 15,
            maxWidth: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 15,
        width: 15,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
        overflows: false,
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: -1,
        left: 10,
        width: 40,
        height: 31,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-center) - maxHeight', () => {
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
            // relative to viewport without scroll
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
            maxHeight: 15,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 10,
        width: 40,
        height: 15,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: 10,
        left: -1,
        width: 62,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-center) - maxWidth', () => {
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
            // relative to viewport without scroll
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
            maxWidth: 30,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 15,
        width: 30,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-center) - minHeight > maxHeight', () => {
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
            // relative to viewport without scroll
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
            minHeight: 15,
            maxHeight: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 10,
        width: 40,
        height: 15,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 30,
      });
    });

    it('computes available space and dimensions (bottom-center) - minWidth > maxWidth', () => {
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
            // relative to viewport without scroll
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
            minWidth: 50,
            maxWidth: 40,
          },
        ),
      ).toEqual({
        overflows: true,
        top: 10,
        left: 5,
        width: 50,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 30,
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
            // relative to viewport without scroll
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
        overflows: false,
        top: 10,
        left: 30,
        width: 80,
        height: 40,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 60,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: -25,
        left: 30,
        width: 80,
        height: 110,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-left) - maxHeight', () => {
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
            // relative to viewport without scroll
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
            maxHeight: 30,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 30,
        width: 80,
        height: 30,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 60,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: 10,
        left: 30,
        width: 200,
        height: 40,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-left) - maxWidth', () => {
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
            // relative to viewport without scroll
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
            maxWidth: 60,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 30,
        width: 60,
        height: 40,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-left) - minHeight > maxHeight', () => {
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
            // relative to viewport without scroll
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
            minHeight: 30,
            maxHeight: 20,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 30,
        width: 80,
        height: 30,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-left) - minWidth > maxWidth', () => {
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
            // relative to viewport without scroll
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
            minWidth: 60,
            maxWidth: 50,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 30,
        width: 60,
        height: 40,
        maxTop: 0,
        maxLeft: 30,
        maxWidth: 90,
        maxHeight: 60,
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
            // relative to viewport without scroll
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
        overflows: false,
        top: 10,
        left: 10,
        width: 20,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 60,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: -1,
        left: 10,
        width: 20,
        height: 62,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-right) - maxHeight', () => {
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
            // relative to viewport without scroll
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
            maxHeight: 30,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 10,
        width: 20,
        height: 30,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 60,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: 10,
        left: -1,
        width: 31,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-right) - maxWidth', () => {
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
            // relative to viewport without scroll
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
            maxWidth: 10,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 20,
        width: 10,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-right) - minHeight > maxHeight', () => {
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
            // relative to viewport without scroll
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
            minHeight: 30,
            maxHeight: 20,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 10,
        width: 20,
        height: 30,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-right) - minWidth > maxWidth', () => {
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
            // relative to viewport without scroll
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
            minWidth: 10,
            maxWidth: 5,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 20,
        width: 10,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 30,
        maxHeight: 60,
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
            // relative to viewport without scroll
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
        overflows: false,
        top: 10,
        left: 10,
        width: 40,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 60,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: -70,
        left: 10,
        width: 40,
        height: 200,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-center) - maxHeight', () => {
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
            // relative to viewport without scroll
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
            maxHeight: 20,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 20,
        left: 10,
        width: 40,
        height: 20,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 60,
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
            // relative to viewport without scroll
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
        overflows: true,
        top: 10,
        left: -70,
        width: 200,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-center) - maxWidth', () => {
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
            // relative to viewport without scroll
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
            maxWidth: 20,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 20,
        width: 20,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-center) - minHeight > maxHeight', () => {
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
            // relative to viewport without scroll
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
            minHeight: 30,
            maxHeight: 20,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 15,
        left: 10,
        width: 40,
        height: 30,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 60,
      });
    });

    it('computes available space and dimensions (center-center) - minWidth > maxWidth', () => {
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
            // relative to viewport without scroll
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
            minWidth: 30,
            maxWidth: 20,
          },
        ),
      ).toEqual({
        overflows: false,
        top: 10,
        left: 15,
        width: 30,
        height: 40,
        maxTop: 0,
        maxLeft: 0,
        maxWidth: 60,
        maxHeight: 60,
      });
    });
  });
});
