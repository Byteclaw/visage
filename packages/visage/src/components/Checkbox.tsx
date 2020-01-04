import {
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, {
  ReactNode,
  KeyboardEvent,
  forwardRef,
  Ref,
  MouseEvent,
  useCallback,
} from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../types';
import {
  visuallyHiddenStyles,
  visuallyHiddenBooleanVariant,
  disabledControlBooleanVariant,
  disabledControlStyles,
  createControlFocusShadow,
} from './shared';
import { Flex } from './Flex';
import { Svg } from './Svg';

const CheckboxControl = createComponent('input', {
  displayName: 'CheckboxControl',
  defaultStyles: {
    ...visuallyHiddenStyles,
    // + div means that we target CheckboxToggler
    '&:focus + div': {
      boxShadow: createControlFocusShadow(),
    },
    '& + div': {
      backgroundColor: 'textInput',
    },
    // set up color so svg has correct color
    '&:checked + div': {
      backgroundColor: 'primary',
      color: 'primaryText',
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
    },
  },
});

const CheckboxLabel = createComponent('label', {
  displayName: 'CheckboxLabel',
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

const CheckboxLabelText = createComponent('span', {
  displayName: 'CheckboxLabelText',
  defaultStyles: props => ({
    fontSize: 'inherit',
    lineHeight: 'inherit',
    ...(props.hidden ? visuallyHiddenStyles : {}),
  }),
  variants: [visuallyHiddenBooleanVariant],
});

const CheckboxToggler = createComponent(Flex, {
  displayName: 'CheckboxToggler',
  defaultProps: {
    'aria-hidden': true,
    children: (
      <Svg
        viewBox="0 0 24 24"
        styles={{
          width: '1em',
          height: '1em',
          stroke: 'textInput',
          strokeWidth: '2px',
          fill: 'none',
        }}
      >
        <polyline points="20 6 9 17 4 12" />
      </Svg>
    ),
  },
  defaultStyles: {
    alignSelf: 'center',
    transition: 'all 150ms',
    borderColor: 'lightAccent',
    borderRadius: '3px',
    borderStyle: 'solid',
    borderWidth: '2px',
    mr: 1,
  },
});

interface CheckboxProps
  extends ExtractVisageComponentProps<typeof CheckboxControl> {
  hiddenLabel?: boolean;
  invalid?: boolean;
  label: ReactNode;
}

export const Checkbox: VisageComponent<CheckboxProps, StyleProps> = forwardRef(
  function Checkbox(
    {
      defaultChecked,
      disabled,
      checked,
      hiddenLabel = false,
      id,
      invalid,
      label,
      name,
      onChange,
      readOnly,
      styles,
      value,
    }: CheckboxProps,
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
      <CheckboxLabel disabled={disabled} styles={styles}>
        <CheckboxControl
          aria-invalid={invalid}
          defaultChecked={defaultChecked}
          checked={checked}
          disabled={disabled}
          id={id}
          name={name}
          onKeyDown={preventOnToggle}
          onClick={preventOnToggle}
          onChange={onChange}
          ref={ref}
          readOnly={readOnly}
          type="checkbox"
          value={value}
        />
        <CheckboxToggler />
        &#8203; {/* fixes height if label is hidden */}
        <CheckboxLabelText hidden={hiddenLabel}>{label}</CheckboxLabelText>
      </CheckboxLabel>
    );
  },
);
