export interface ScaleValue<T> {
  values: T[];
  /**
   * The middle of scale, positive indexes are calculated to the right of offset
   * Negative values to the left
   */
  offset: number;
}

export function getScaleValue<T>(
  value: ScaleValue<T>,
  position: number = 0,
): T {
  const minValue = value.values[0];
  const maxValue = value.values[value.values.length - 1];
  const index = value.offset + position;

  if (index < 0) {
    return minValue;
  } if (index > value.values.length - 1) {
    return maxValue;
  }

  return value.values[index];
}
