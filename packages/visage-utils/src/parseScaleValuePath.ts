/**
 * Parses property name and scale value index from scalePath
 */
export function parseScaleValuePath(
  scalePath: any,
): [
  /** Scale property name (for nested values like primary.-1) */
  string,
  /**  Index of scale value to use */
  number,
] {
  const [path, offset] = `${scalePath}`.split('.');
  const index = Number(offset == null ? path : offset);

  return [path, Number.isNaN(index) ? 0 : index];
}
