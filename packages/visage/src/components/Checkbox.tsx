import { useUniqueId } from '@byteclaw/use-unique-id';
import {
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { ReactNode, forwardRef, Ref, useMemo } from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../types';
import {
  visuallyHiddenStyles,
  visuallyHiddenBooleanVariant,
  invalidControlStyles,
  invalidControlBooleanVariant,
  disabledControlBooleanVariant,
  disabledControlStyles,
} from './shared';
import { Flex } from './Flex';
import { Svg } from './Svg';

const CheckboxControl = createComponent('input', {
  displayName: 'CheckboxControl',
  defaultStyles: {
    ...visuallyHiddenStyles,
    // prevent blinking when clicking on already focused checkbox
    '&[aria-invalid="true"] + div': {
      boxShadow: '0 0 0 2px danger',
    },
    '&:focus + div, &:active:not([disabled]) + div': {
      boxShadow: '0 0 0 3px darkAccent',
    },
    '& + div': {
      backgroundColor: 'lightAccent',
    },
    '&:checked + div': {
      backgroundColor: 'primary',
    },
    '& + div > svg': {
      visibility: 'hidden',
    },
    '&:checked + div > svg': {
      visibility: 'visible',
    },
    '&:disabled + div': {
      backgroundColor: 'lightAccent',
      opacity: 0.3,
    },
  },
  variants: [visuallyHiddenBooleanVariant],
});

const CheckboxLabel = createComponent('label', {
  displayName: 'CheckboxLabel',
  defaultStyles: props => ({
    display: 'flex',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    cursor: 'pointer',
    position: 'relative',
    outline: 'none',
    userSelect: 'none',
    ...(props.disabled ? disabledControlStyles : {}),
    ...(props.invalid ? invalidControlStyles : {}),
  }),
  variants: [invalidControlBooleanVariant, disabledControlBooleanVariant],
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

const CheckboxWrapper = createComponent('div', {
  displayName: 'CheckboxWrapper',
  defaultStyles: {
    display: 'flex',
    flex: '1',
    fontSize: 0,
    lineHeight: 0,
    alignItems: 'flex-start',
    m: 0,
    p: 0,
  },
});

interface CheckboxProps
  extends ExtractVisageComponentProps<typeof CheckboxControl> {
  hiddenLabel?: boolean;
  invalid?: boolean;
  label: ReactNode;
}

const togglerStyles = {
  alignSelf: 'center',
  transition: 'all 150ms',
  borderRadius: '3px',
  mr: 1,
};

export const Checkbox: VisageComponent<CheckboxProps, StyleProps> = forwardRef(
  function Checkbox(
    {
      defaultChecked,
      disabled,
      checked,
      hiddenLabel = false,
      id: outerId,
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
    const idTemplate = useUniqueId();
    const id = useMemo(() => {
      return outerId || `chkbx-${idTemplate}`;
    }, [outerId, idTemplate]);

    return (
      <CheckboxWrapper styles={styles}>
        <CheckboxLabel invalid={invalid} disabled={disabled} htmlFor={id}>
          <CheckboxControl
            aria-invalid={invalid}
            defaultChecked={defaultChecked}
            checked={checked}
            disabled={disabled}
            id={id}
            name={name}
            onKeyDown={e => {
              if (readOnly && e.key === ' ') {
                e.preventDefault();
              }
            }}
            onClick={e => {
              if (readOnly) {
                e.preventDefault();
              }
            }}
            onChange={onChange}
            ref={ref}
            readOnly={readOnly}
            tabIndex={0}
            type="checkbox"
            value={value}
          />
          <Flex aria-hidden styles={togglerStyles}>
            <Svg
              viewBox="0 0 24 24"
              styles={{
                width: '1em',
                height: '1em',
                stroke: 'white',
                strokeWidth: '2px',
                fill: 'none',
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </Svg>
          </Flex>
          <CheckboxLabelText hidden={hiddenLabel}>{label}</CheckboxLabelText>
        </CheckboxLabel>
      </CheckboxWrapper>
    );
  },
);
