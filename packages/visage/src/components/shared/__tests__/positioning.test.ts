import {
  getOffsetLeft,
  getOffsetTop,
  // getTransformOriginValue,
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
});
