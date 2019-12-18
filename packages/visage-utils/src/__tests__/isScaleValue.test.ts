import { isScaleValue } from '..';

describe('isScaleValue', () => {
  it('works correctly', () => {
    expect(isScaleValue(undefined)).toBe(false);
    expect(isScaleValue(null)).toBe(false);
    expect(isScaleValue(true)).toBe(false);
    expect(isScaleValue(Date)).toBe(false);
    expect(isScaleValue([])).toBe(false);
    expect(isScaleValue({})).toBe(false);
    expect(isScaleValue(10)).toBe(false);
    expect(isScaleValue({ offset: 'a', values: [] })).toBe(false);
    expect(isScaleValue({ offset: 0, values: [] })).toBe(true);
  });
});
