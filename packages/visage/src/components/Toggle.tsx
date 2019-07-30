import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, {
  // ChangeEventHandler,
  // KeyboardEventHandler,
  // MouseEventHandler,
  // ReactElement,
  ReactNode,
  // useCallback,
  // useRef,
  // useState,
} from 'react';
// import { createBooleanVariant, createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';

interface ToggleProps extends VisageStyleProps<StyleProps> {
  // checked?: boolean;
  // defaultChecked?: boolean;
  // disabled?: boolean;
  // hiddenLabel?: boolean;
  label: ReactNode;
  // name?: string;
  // onChange?: ChangeEventHandler<HTMLInputElement>;
  // readOnly?: boolean;
  // wrapper?: ReactElement;
}

export const Toggle: VisageComponent<
  ToggleProps,
  StyleProps
> = function Toggle({
  // defaultChecked,
  // disabled,
  // checked,
  // hiddenLabel = false,
  label,
}: // name,
// onChange,
// readOnly,
// styles,
ToggleProps) {
  return <div>{label}</div>;
};
