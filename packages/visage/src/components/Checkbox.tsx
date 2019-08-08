import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { createBooleanVariant, createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';

const CheckboxControl = createComponent('input', {
  displayName: 'CheckboxControl',
  defaultStyles: {
    border: '0',
    clip: 'rect(0, 0, 0, 0)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    margin: '-1px',
    padding: '0px',
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    width: '1px',
  },
});

const labelCheckedVariant = createBooleanVariant('checked', {
  onStyles: {
    '&::after': {
      backgroundColor: 'none',
      borderLeft: '2px solid black',
      borderBottom: '2px solid black',
      content: '""',
      height: '.3em',
      left: '0px',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%) translateX(33%) rotate(-45deg)',
      transformOrigin: 'center',
      width: '.6em',
    },
  },
});

const labelDisabledVariant = createBooleanVariant('disabled', {
  onStyles: {
    color: 'grey.1',
    cursor: 'not-allowed',
    '&::before': {
      borderColor: 'grey.1',
    },
    '&::after': {
      borderColor: 'grey.1',
    },
  },
  offStyles: {
    ':focus::before': {
      borderColor: 'blue',
      borderWidth: '2px',
    },
  },
});

const CheckboxLabel = labelDisabledVariant(
  labelCheckedVariant(
    createComponent('label', {
      displayName: 'CheckboxLabel',
      defaultStyles: {
        '&::before': {
          content: '""',
          alignSelf: 'center',
          borderStyle: 'solid',
          borderColor: 'black',
          borderWidth: '1px',
          display: 'inline-flex',
          height: '1em',
          m: 0,
          mr: 1,
          overflow: 'hidden',
          p: 0,
          position: 'relative',
          width: '1em',
        },
        display: 'flex',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        cursor: 'pointer',
        position: 'relative',
        outline: 'none',
        userSelect: 'none',
      },
    }),
  ),
);

const labelTextHiddenVariant = createBooleanVariant('hidden', {
  onStyles: {
    border: '0',
    clip: 'rect(0, 0, 0, 0)',
    overflow: 'hidden',
    margin: '-1px',
    padding: '0px',
    whiteSpace: 'nowrap',
    width: '0px',
  },
});

const CheckboxLabelText = labelTextHiddenVariant(
  createComponent('span', {
    displayName: 'CheckboxLabelText',
    defaultStyles: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
    },
  }),
);

const CheckboxWrapper = createComponent('div', {
  displayName: 'CheckboxWrapper',
  defaultStyles: {
    display: 'flex',
    flex: '1',
    fontSize: 0,
    lineHeight: 0,
    alignItems: 'flex-start',
    m: 0,
    mb: 1,
    p: 0,
  },
});

interface CheckboxProps extends VisageStyleProps<StyleProps> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  hiddenLabel?: boolean;
  label: ReactNode;
  name?: string;
  onChange?: (checked: boolean) => void;
  readOnly?: boolean;
  value?: any;
  wrapper?: ReactElement;
}

const defaultOnChange = () => {};

export const Checkbox: VisageComponent<
  CheckboxProps,
  StyleProps
> = function Checkbox({
  defaultChecked,
  disabled,
  checked,
  hiddenLabel = false,
  label,
  name,
  onChange = defaultOnChange,
  readOnly,
  styles,
  value,
}: CheckboxProps) {
  const isControlled = checked != null;
  const checkedValue = !!(defaultChecked || checked);
  const id = `chkbx-${name}`;
  const [isChecked, setChecked] = useState(checkedValue);
  const currentCheckedValueRef = useRef(checkedValue);
  const outerValueRef = useRef(checkedValue);
  const onClick: MouseEventHandler<HTMLLabelElement> = useCallback(
    () => (!isControlled ? setChecked(!isChecked) : onChange(!isChecked)),
    [isControlled, isChecked, onChange],
  );
  const onKeyDown: KeyboardEventHandler<HTMLLabelElement> = useCallback(
    e => {
      if (e.key === ' ') {
        e.preventDefault();

        if (!isControlled) {
          setChecked(!isChecked);
        } else {
          onChange(!isChecked);
        }
      }
    },
    [isControlled, isChecked, onChange],
  );

  if (!isControlled && currentCheckedValueRef.current !== isChecked) {
    currentCheckedValueRef.current = isChecked;

    onChange(isChecked);
  }

  if (isControlled && outerValueRef.current !== checkedValue) {
    outerValueRef.current = checkedValue;

    setChecked(checkedValue);
  }

  return (
    <CheckboxWrapper styles={styles}>
      <CheckboxControl
        checked={isChecked}
        disabled={disabled}
        id={id}
        name={name}
        onChange={defaultOnChange}
        readOnly={readOnly}
        type="checkbox"
        value={value}
      />
      <CheckboxLabel
        aria-checked={isChecked}
        aria-disabled={!!disabled}
        aria-readonly={!!readOnly}
        checked={isChecked}
        disabled={disabled}
        htmlFor={id}
        role="checkbox"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={!disabled && !readOnly ? onKeyDown : undefined}
        onClick={!disabled && !readOnly ? onClick : undefined}
      >
        <CheckboxLabelText hidden={hiddenLabel}>{label}</CheckboxLabelText>
      </CheckboxLabel>
    </CheckboxWrapper>
  );
};
