/**
 * This is a prop setting for omitProps helper
 */
export interface OmitPropsSetting {
  /** Name of prop on input object */
  prop: string;
  /** Name that will be used for prop on output prefixed by data- for example name -> data-name */
  name: string;
  /** Should we strip the prop from the input object? */
  stripProp?: boolean;
  /** Default value for output prop */
  defaultValue?: any;
}

/**
 * Omits props from an object based on settings
 */
export function omitProps(
  props: { [key: string]: any },
  settings: OmitPropsSetting[],
): { [key: string]: any } {
  const clone = { ...props };
  const settingsLength = settings.length;

  for (let i = 0; i < settingsLength; i++) {
    const setting = settings[i];

    clone[`data-${setting.name}`] = clone[setting.prop] || setting.defaultValue;

    if (setting.stripProp) {
      delete clone[setting.prop];
    }
  }

  return clone;
}
