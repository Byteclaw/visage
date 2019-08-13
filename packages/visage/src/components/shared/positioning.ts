export interface TransformOriginSettings {
  horizontal: number | string;
  vertical: number | string;
}

export function getOffsetTop(
  rect: ClientRect | DOMRect,
  vertical: 'top' | 'center' | 'bottom' | number,
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
  rect: ClientRect | DOMRect,
  horizontal: 'left' | 'center' | 'right' | number,
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
