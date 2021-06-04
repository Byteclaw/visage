function isObj<T>(obj: T): obj is T {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export function depthFirstObjectMerge<
  T extends { [key: string]: any } = { [key: string]: any },
>(...obj: T[]): T {
  if (obj.length === 1) {
    return obj[0];
  }

  return obj.reduceRight((current, target) => {
    const currentKeys: (keyof T)[] = Object.keys(current);
    const previousKeys: (keyof T)[] = Object.keys(target);
    const res: T = { ...target } as T;

    for (let keyIndex = 0; keyIndex < currentKeys.length; keyIndex++) {
      const currentKey = currentKeys[keyIndex];
      const value = current[currentKey];

      // if current value is not in previous value, use it as it is
      if (!previousKeys.includes(currentKey)) {
        res[currentKey] = value;
      } else if (isObj<T>(value)) {
        // current value is an object, perform deep merge if the both values are objects
        if (isObj(target[currentKey])) {
          res[currentKey] = depthFirstObjectMerge(target[currentKey], value);
        } else {
          res[currentKey] = value;
        }
      } else {
        res[currentKey] = value;
      }
    }

    return res;
  });
}
