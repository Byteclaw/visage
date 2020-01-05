import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, {
  ChangeEventHandler,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  forwardRef,
  Ref,
  useCallback,
} from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../types';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  visuallyHiddenBooleanVariant,
  visuallyHiddenStyles,
  createControlFocusShadow,
} from './shared';
import { Flex } from './Flex';
import { Svg } from './Svg';

const RadioControl = createComponent('input', {
  displayName: 'RadioControl',
  defaultStyles: {
    ...visuallyHiddenStyles,
    '&:focus + div': {
      boxShadow: createControlFocusShadow(),
    },
    '& + div': {
      backgroundColor: 'textInput',
    },
    '&:checked + div': {
      backgroundColor: 'primary',
      borderColor: 'primary',
    },
    // because we want to see that input is invalid even if it's checked
    '&[aria-invalid="true"] + div': {
      borderColor: 'danger',
    },
    '& + div > svg': {
      visibility: 'hidden',
    },
    '&:checked + div > svg': {
      visibility: 'visible',
      fill: 'textInput',
    },
  },
});

const RadioLabel = createComponent('label', {
  displayName: 'RadioLabel',
  defaultStyles: props => ({
    alignItems: 'flex-start',
    cursor: 'pointer',
    display: 'flex',
    flex: '1',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    m: 0,
    outline: 'none',
    p: 0,
    position: 'relative',
    userSelect: 'none',
    ...(props.disabled ? disabledControlStyles : {}),
  }),
  variants: [disabledControlBooleanVariant],
});

const RadioLabelText = createComponent('span', {
  displayName: 'RadioLabelText',
  defaultStyles: props => ({
    fontSize: 'inherit',
    lineHeight: 'inherit',
    ...(props.hidden ? visuallyHiddenStyles : {}),
  }),
  variants: [visuallyHiddenBooleanVariant],
});

const RadioToggler = createComponent(Flex, {
  displayName: 'RadioToggler',
  defaultProps: {
    'aria-hidden': true,
    children: (
      <Svg
        viewBox="0 0 24 24"
        styles={{
          width: '1em',
          height: '1em',
        }}
      >
        <circle cx="12" cy="12" r="6" />
      </Svg>
    ),
  },
  defaultStyles: {
    background: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    transition: 'all 150ms',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: 'lightAccent',
    mr: 1,
  },
});

interface RadioProps extends VisageStyleProps<StyleProps> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  hiddenLabel?: boolean;
  /**
   * Id is required for a group
   */
  id?: string;
  invalid?: boolean;
  label: ReactNode;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  value?: any;
  wrapper?: ReactElement;
}

export const Radio: VisageComponent<RadioProps, StyleProps> = forwardRef(
  function Radio(
    {
      checked,
      defaultChecked,
      disabled,
      hiddenLabel = false,
      id,
      invalid,
      label,
      name,
      onChange,
      readOnly,
      styles,
      value,
    }: RadioProps,
    ref: Ref<HTMLInputElement>,
  ) {
    const preventOnToggle = useCallback(
      (e: KeyboardEvent | MouseEvent) => {
        if (readOnly) {
          if ((e as any).key != null && (e as KeyboardEvent).key !== ' ') {
            return;
          }

          e.preventDefault();
        }
      },
      [readOnly],
    );

    return (
      <RadioLabel disabled={disabled} styles={styles}>
        <RadioControl
          aria-invalid={invalid}
          defaultChecked={defaultChecked}
          checked={checked}
          disabled={disabled}
          id={id}
          name={name}
          onChange={onChange}
          onClick={preventOnToggle}
          onKeyDown={preventOnToggle}
          ref={ref}
          type="radio"
          value={value}
        />
        <RadioToggler />
        &#8203; {/* fixes height if label is hidden */}
        <RadioLabelText hidden={hiddenLabel}>{label}</RadioLabelText>
      </RadioLabel>
    );
  },
);
