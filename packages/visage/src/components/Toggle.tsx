import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, {
  ChangeEventHandler,
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
import { Flex } from './Flex';

interface ToggleProps extends VisageStyleProps<StyleProps> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  hiddenLabel?: boolean;
  label: ReactNode;
  leftContent?: ReactNode;
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  rightContent?: ReactNode;
  wrapper?: ReactElement;
}

const containerCheckedVariant = createBooleanVariant('checked', {
  onStyles: {
    backgroundColor: 'green',
  },
  offStyles: {
    backgroundColor: 'primary',
  },
});

const containerDisabledVariant = createBooleanVariant('disabled', {
  onStyles: {
    backgroundColor: 'grey.1',
  },
  offStyles: {
    ':focus': {
      borderColor: 'blue',
      borderWidth: '2px',
    },
  },
});

const ToggleContainer = containerDisabledVariant(
  containerCheckedVariant(
    createComponent('div', {
      displayName: 'ToggleContainer',
      defaultStyles: {
        overflowX: 'hidden',
        borderRadius: 999,
        width: 'auto',
        display: 'inline-flex',
        position: 'relative',
        height: '1.5em',
        minWidth: '3em',
        backgroundColor: 'primary',
        fontSize: '20px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        outline: 'none',
        userSelect: 'none',
      },
    }),
  ),
);

const ToggleControl = createComponent('input', {
  displayName: 'ToggleControl',
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

const Toggler = createComponent('div', {
  displayName: 'Toggler',
  defaultStyles: {
    fontSize: 'inherit',
    display: 'inline-block',
    top: 0,
    left: 0,
    padding: '1px',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    position: 'relative',
    transitionProperty: 'transform, color',
    transitionDuration: '0.1s',
    transitionTimingFunction: 'ease-out',
    '&::after': {
      content: '""',
      verticalAlign: 'middle',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1.25em',
      height: '1.25em',
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: 'white',
      transitionProperty: 'transform, color',
      transitionDuration: '0.1s',
      mx: '1px',
      transitionTimingFunction: 'ease-out',
    },
    '&::before': {
      content: 'attr(data-label-content)',
      position: 'absolute',
      mx: 1,
      fontSize: '0.75em',
      textAlign: 'center',
      color: 'white',
      left: 'calc(50%)',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: 0,
      whiteSpace: 'nowrap',
    },
  },
});

const ToggleLabel = createComponent('label', {
  displayName: 'ToggleLabel',
  defaultStyles: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    cursor: 'pointer',
    position: 'relative',
    outline: 'none',
    userSelect: 'none',
    mx: 1,
  },
});

export const Toggle: VisageComponent<
  ToggleProps,
  StyleProps
> = function Toggle({
  defaultChecked,
  disabled,
  checked,
  hiddenLabel = false,
  label,
  leftContent,
  rightContent,
  name,
  onChange,
  readOnly,
  styles,
  value,
}: ToggleProps) {
  const checkedValue = checked != null ? checked : !!defaultChecked;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const id = `toggle-${name}`;
  const [isChecked, setChecked] = useState(checkedValue);
  const checkedRef = useRef(checkedValue);
  const onClick: MouseEventHandler<HTMLElement> = useCallback(() => {
    if (inputRef.current) {
      setChecked(!inputRef.current.checked);
    }
  }, [inputRef]);
  const onKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(
    e => {
      if (inputRef.current && e.key === ' ') {
        e.preventDefault();
        setChecked(!inputRef.current.checked);
      }
    },
    [inputRef],
  );
  const isMutable = !disabled && !readOnly;
  const ariaChecked = isChecked.toString() as 'true' | 'false';
  const ariaDisabled = (!!disabled).toString() as 'true' | 'false';
  const ariaReadOnly = (!!readOnly).toString() as 'true' | 'false';

  if (checkedRef.current !== checkedValue) {
    checkedRef.current = checkedValue;
    setChecked(checkedValue);
  }

  return (
    <Flex styles={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <ToggleContainer
        styles={styles}
        onKeyDown={!disabled && !readOnly ? onKeyDown : undefined}
        onClick={!disabled && !readOnly ? onClick : undefined}
        checked={isChecked}
        disabled={disabled}
        role="checkbox"
        tabIndex={disabled ? -1 : 0}
        aria-checked={ariaChecked}
        aria-disabled={ariaDisabled}
        aria-readonly={ariaReadOnly}
      >
        <ToggleControl
          defaultChecked={isMutable ? undefined : isChecked}
          disabled={disabled}
          checked={isMutable ? isChecked : undefined}
          id={id}
          name={name}
          onChange={onChange}
          ref={inputRef}
          readOnly={readOnly}
          value={value}
          type="checkbox"
        />
        <Toggler
          data-label-content={isChecked ? rightContent : leftContent}
          styles={{
            transform: `translateX(${
              isChecked ? 'calc(100% - 1.25em - 4px)' : '0'
            })`,
          }}
        />
      </ToggleContainer>
      {label != null && (
        <ToggleLabel
          onKeyDown={!disabled && !readOnly ? onKeyDown : undefined}
          onClick={!disabled && !readOnly ? onClick : undefined}
          checked={isChecked}
          disabled={disabled}
          htmlFor={id}
          hidden={hiddenLabel}
        >
          {label}
        </ToggleLabel>
      )}
    </Flex>
  );
};
