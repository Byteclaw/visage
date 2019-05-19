type ValidValues = boolean | null | number | string | undefined;

function toArray<T extends ValidValues>(
  value: (T | undefined)[] | T | undefined,
  expectedLength: number,
): T[] {
  const normalized = Array(expectedLength);

  if (Array.isArray(value)) {
    normalized.unshift(...value);
  } else {
    normalized.fill(value);
  }

  return normalized;
}

export function getResponsiveValue<T extends ValidValues>(
  breakpoint: number,
  defaultValue: T[] | T,
  newValue?: T[] | T,
): T {
  // null in default means, there is no value
  // null in value means, there is no value, even if there is a value in default
  // undefined in default means, there is no value
  // undefined in value means, use the default value at given index

  const valuesLength = breakpoint + 1; // because breakpoints are indexed from 0
  // convert value and default value to arrays
  const newValueArr = toArray<T>(newValue, valuesLength);
  const defaultValArr = toArray<T>(defaultValue, valuesLength);
  let defaultVal: T = defaultValArr[0];
  let newVal: T | undefined =
    newValueArr[0] === undefined ? defaultVal : newValueArr[0];

  // now we need to iterate only to breakpoint
  for (let i = 1; i <= breakpoint; i++) {
    defaultVal = defaultValArr[i] === undefined ? defaultVal : defaultValArr[i];
    newVal = newValueArr[i];
  }

  // new value is from user, default value is from source (e.g. theme)
  // new value always overrides default value
  // except if there is undefined value at the breakpoint's index
  return newVal !== undefined ? newVal : defaultVal;
}
