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
import { createComponent, createVariant } from '../core';
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

const CheckboxLabel = createVariant(
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
      ':focus::before': {
        borderColor: 'red',
        borderWidth: '2px',
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
  'variant',
  {
    checked: {
      '&::after': {
        background: 'none',
        borderLeft: '2px solid black',
        borderBottom: '2px solid black',
        alignSelf: 'center',
        content: '""',
        height: '.3em',
        left: '.2em',
        position: 'absolute',
        top: '.325em',
        transform: 'scale(1) rotate(-45deg)',
        transformOrigin: 'bottom right',
        width: '.6em',
      },
    },
    default: {},
  },
);

const CheckboxLabelText = createVariant(
  createComponent('span', {
    displayName: 'CheckboxLabelText',
    defaultStyles: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
    },
  }),
  'variant',
  {
    invisible: {},
    default: {},
  },
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
  hiddenLabel?: boolean;
  label: ReactNode;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  wrapper?: ReactElement;
}

export const Checkbox: VisageComponent<
  CheckboxProps,
  StyleProps
> = function Checkbox({
  defaultChecked,
  checked,
  hiddenLabel = false,
  label,
  name,
  onChange,
  styles,
}: CheckboxProps) {
  const checkedValue = checked != null ? checked : !!defaultChecked;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const id = `chkbx-${name}`;
  const [isChecked, setChecked] = useState(checkedValue);
  const checkedRef = useRef(checkedValue);
  const onClick: MouseEventHandler<HTMLLabelElement> = useCallback(() => {
    if (inputRef.current) {
      setChecked(!inputRef.current.checked);
    }
  }, [inputRef]);
  const onKeyDown: KeyboardEventHandler<HTMLLabelElement> = useCallback(
    e => {
      if (inputRef.current && e.key === ' ') {
        e.preventDefault();
        setChecked(!inputRef.current.checked);
      }
    },
    [inputRef],
  );
  const ariaChecked = isChecked.toString() as 'true' | 'false';

  // if value from outside has changed, set the internal state
  if (checkedRef.current !== checkedValue) {
    setChecked(checkedValue);
  }

  return (
    <CheckboxWrapper styles={styles}>
      <CheckboxControl
        aria-checked={ariaChecked}
        defaultChecked={isChecked}
        checked={isChecked}
        id={id}
        name={name}
        onChange={onChange}
        ref={inputRef}
        type="checkbox"
      />
      <CheckboxLabel
        htmlFor={id}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onClick={onClick}
        variant={isChecked ? 'checked' : undefined}
      >
        <CheckboxLabelText variant={hiddenLabel ? 'invisible' : undefined}>
          {label}
        </CheckboxLabelText>
      </CheckboxLabel>
    </CheckboxWrapper>
  );
};
