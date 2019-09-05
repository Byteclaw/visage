export interface TransformOriginSettings {
  horizontal: TransformHorizontalPosition;
  vertical: TransformVerticalPosition;
}

export type TransformHorizontalPosition = 'left' | 'center' | 'right' | number;
export type TransformVerticalPosition = 'top' | 'center' | 'bottom' | number;

export interface ElementRect {
  height: number;
  width: number;
}

export function getOffsetTop(
  rect: ElementRect,
  vertical: TransformVerticalPosition,
): number {
  let offset = 0;

  if (typeof vertical === 'number') {
    offset = vertical;
  } else if (vertical === 'center') {
    offset = rect.height / 2;
  } else if (vertical === 'bottom') {
    offset = rect.height;
  }

  return offset;
}

export function getOffsetLeft(
  rect: ElementRect,
  horizontal: TransformHorizontalPosition,
): number {
  let offset = 0;

  if (typeof horizontal === 'number') {
    offset = horizontal;
  } else if (horizontal === 'center') {
    offset = rect.width / 2;
  } else if (horizontal === 'right') {
    offset = rect.width;
  }

  return offset;
}

export function getTransformOriginValue({
  horizontal,
  vertical,
}: TransformOriginSettings): string {
  return [horizontal, vertical]
    .map(n => (typeof n === 'number' ? `${n}px` : n))
    .join(' ');
}
