import { ScaleValue } from './getScaleValue';

export function isScaleValue<T = any>(value: any): value is ScaleValue<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.offset === 'number' &&
    Array.isArray(value.values)
  );
}
