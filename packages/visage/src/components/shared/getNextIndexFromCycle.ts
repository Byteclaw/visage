export function getNextIndexFromCycle(
  currentIndex: number,
  offset: number,
  lastIndex: number,
) {
  if (currentIndex < -1 || currentIndex > lastIndex) {
    // eslint-disable-next-line no-param-reassign
    currentIndex = offset > 0 ? -1 : lastIndex + 1;
  }

  const newIndex = currentIndex + offset;

  if (newIndex < 0) {
    return lastIndex;
  }
  if (newIndex > lastIndex) {
    return 0;
  }

  return newIndex;
}
