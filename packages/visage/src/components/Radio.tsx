import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, {
  createContext,
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
  useMemo,
} from 'react';
import { createBooleanVariant, createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
import { visuallyHiddenStripped, visuallyHiddenStyles } from './shared';

const RadioGroupContext = createContext<{
  mounted: boolean; // is context mounted (provided by provider)
  name: string;
  value: any;
  onChange: ChangeEventHandler<HTMLInputElement>;
}>({
  mounted: false,
  name: '',
  value: undefined,
  onChange: () => {},
});

interface RadioGroupProps {
  children: ReactNode;
  defaultValue?: any;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: any;
}

export function RadioGroup({
  children,
  defaultValue,
  name,
  onChange,
  value,
}: RadioGroupProps) {
  const valueRef = useRef(value);
  const [currentValue, setValue] = useState(defaultValue);
  const internalOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      if (e.currentTarget.checked) {
        setValue(e.currentTarget.value);
      }

      if (onChange) {
        onChange(e);
      }
    },
    [onChange],
  );
  const ctx = useMemo(
    () => ({
      mounted: true,
      name,
      value: currentValue,
      onChange: internalOnChange,
    }),
    [name, currentValue, internalOnChange],
  );

  if (valueRef.current !== value) {
    valueRef.current = value;
    setValue(value);
  }

  return (
    <RadioGroupContext.Provider value={ctx}>
      {children}
    </RadioGroupContext.Provider>
  );
}

const RadioControl = createComponent('input', {
  displayName: 'RadioControl',
  defaultStyles: visuallyHiddenStyles,
});

const labelCheckedVariant = createBooleanVariant('checked', {
  onStyles: {
    '&::after': {
      backgroundColor: 'black',
      borderRadius: '50%',
      content: '""',
      height: '.4em',
      left: '.3em',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      transformOrigin: 'center',
      width: '.4em',
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
      backgroundColor: 'grey.1',
    },
  },
  offStyles: {
    ':focus::before': {
      borderColor: 'blue',
      borderWidth: '2px',
    },
  },
});

const RadioLabel = labelDisabledVariant(
  labelCheckedVariant(
    createComponent('label', {
      displayName: 'RadioLabel',
      defaultStyles: {
        '&::before': {
          content: '""',
          alignSelf: 'center',
          borderStyle: 'solid',
          borderColor: 'black',
          borderWidth: '1px',
          borderRadius: '50%',
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

const RadioLabelText = visuallyHiddenStripped(
  createComponent('span', {
    displayName: 'RadioLabelText',
    defaultStyles: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
    },
  }),
);

const RadioWrapper = createComponent('div', {
  displayName: 'RadioWrapper',
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

interface RadioProps extends VisageStyleProps<StyleProps> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  hiddenLabel?: boolean;
  label: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value: any;
  wrapper?: ReactElement;
}

export const Radio: VisageComponent<RadioProps, StyleProps> = function Radio({
  checked,
  defaultChecked,
  disabled,
  hiddenLabel = false,
  label,
  onChange,
  styles,
  value,
}: RadioProps) {
  const radioGroup = useContext(RadioGroupContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const id = `radio-${radioGroup.name}`;
  const onValueChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      e.persist();

      if (onChange) {
        onChange(e);
      }

      if (radioGroup.onChange && radioGroup.mounted) {
        radioGroup.onChange(e);
      }
    },
    [onChange, radioGroup],
  );
  const onClick: MouseEventHandler<HTMLLabelElement> = useCallback(
    e => {
      if (inputRef.current) {
        e.preventDefault();
        inputRef.current.click();
      }
    },
    [inputRef],
  );
  const onKeyDown: KeyboardEventHandler<HTMLLabelElement> = useCallback(
    e => {
      if (inputRef.current && e.key === ' ') {
        e.preventDefault();
        inputRef.current.click();
      }
    },
    [inputRef],
  );
  const isChecked = radioGroup.mounted
    ? radioGroup.value === value
    : !!(checked || defaultChecked);
  const ariaChecked = isChecked.toString() as 'true' | 'false';
  const ariaDisabled = (!!disabled).toString() as 'true' | 'false';

  return (
    <RadioWrapper styles={styles}>
      <RadioControl
        defaultChecked={isChecked}
        disabled={disabled}
        id={id}
        name={radioGroup.name}
        onChange={onValueChange}
        ref={inputRef}
        type="radio"
        value={value}
      />
      <RadioLabel
        aria-checked={ariaChecked}
        aria-disabled={ariaDisabled}
        checked={isChecked}
        disabled={disabled}
        htmlFor={id}
        role="radio"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={!disabled ? onKeyDown : undefined}
        onClick={!disabled ? onClick : undefined}
      >
        <RadioLabelText hidden={hiddenLabel}>{label}</RadioLabelText>
      </RadioLabel>
    </RadioWrapper>
  );
};
