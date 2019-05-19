import { getScaleValue } from '../getScaleValue';

describe('getScaleValue', () => {
  const cases: [any[], number, number, any][] = [
    [[0], 0, 0, 0],
    [[0], 0, -1, 0],
    [[0], 0, 1, 0],
    [[0, 1], 0, 1, 1],
    [[0, 1], 0, -1, 0],
    [[0, 1], 0, 2, 1],
    [[-1, 0, 1], 1, 0, 0],
    [[-1, 0, 1], 1, 1, 1],
    [[-1, 0, 1], 1, 2, 1],
    [[-1, 0, 1], 1, -1, -1],
    [[-1, 0, 1], 1, -2, -1],
  ];

  it.each(cases)(
    'returns correct value for scale %p with offset %i for position %i',
    (scale, offset, position, expected) => {
      expect(getScaleValue({ values: scale, offset }, position)).toBe(expected);
    },
  );
});
