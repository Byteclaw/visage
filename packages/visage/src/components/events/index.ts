import { ChangeEventHandler } from 'react';

/**
 * This event handler prevents onChange or setChecked to be called if readOnly is enabled
 *
 * This event handler should be used in Toggle components, the ones that use onChange handler
 * to detect event.currentTarget.checked
 *
 * If onChange is not provided, setChecked is called.
 */
export function wrapToggleOnChangeHandler(
  readOnly: boolean | undefined,
  onChange: ChangeEventHandler<HTMLInputElement> | undefined,
  setChecked: (checked: boolean) => void,
): ChangeEventHandler<HTMLInputElement> {
  return e => {
    // prevent onChange if readonly
    // disabled is handled automatically by the browser
    if (readOnly) {
      return;
    }

    // onChange is defined, the component is controlled from outside
    if (onChange) {
      onChange(e);
    } else {
      // component is controlled internally
      setChecked(e.currentTarget.checked);
    }
  };
}
