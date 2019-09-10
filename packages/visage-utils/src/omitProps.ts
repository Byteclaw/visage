export function omitProps(
  props: { [key: string]: any },
  settings: {
    name: string;
    stripProp?: boolean;
    defaultValue?: string | boolean;
  }[],
): { [key: string]: any } {
  const clone = Object.assign({}, props);
  const settingsLength = settings.length;

  for (let i = 0; i < settingsLength; i++) {
    const setting = settings[i];

    clone[`data-${setting.name}`] = clone[setting.name] || setting.defaultValue;

    if (setting.stripProp) {
      // react strips props that are undefined, so this is fine
      clone[setting.name] = undefined;
    }
  }

  return clone;
}
