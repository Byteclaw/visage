import { useUniqueId } from '@byteclaw/use-unique-id';
import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, {
  ChangeEventHandler,
  ReactElement,
  ReactNode,
  useMemo,
  forwardRef,
  Ref,
} from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../types';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  invalidControlStyles,
  invalidControlBooleanVariant,
  visuallyHiddenBooleanVariant,
  visuallyHiddenStyles,
} from './shared';
import { Flex } from './Flex';
import { Svg } from './Svg';

const RadioControl = createComponent('input', {
  displayName: 'RadioControl',
  defaultStyles: {
    ...visuallyHiddenStyles,
    // prevent blinking when clicking on already focused radio
    '&[aria-invalid="true"] + div': {
      boxShadow: '0 0 0 2px danger',
    },
    '&:focus + div, &:active:not([disabled]) + div': {
      boxShadow: '0 0 0 3px darkAccent',
    },
    '&:checked + div': {
      backgroundColor: 'primary',
      borderColor: 'primary',
    },
    '& + div > svg': {
      visibility: 'hidden',
    },
    '&:checked + div > svg': {
      visibility: 'visible',
      fill: 'white',
    },
    '&:disabled + div, &:disabled + div > svg': {
      borderColor: 'lightAccent',
      fill: 'lightAccent',
      opacity: 0.3,
    },
  },
});

const RadioLabel = createComponent('label', {
  displayName: 'RadioLabel',
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
  variants: [disabledControlBooleanVariant, invalidControlBooleanVariant],
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

const RadioWrapper = createComponent('div', {
  displayName: 'RadioWrapper',
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

const togglerStyles = {
  background: 'rgba(255,255,255,0.3)',
  alignSelf: 'center',
  transition: 'all 150ms',
  borderRadius: 999,
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: 'lightAccent',
  mr: 1,
};

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
      id: outerId,
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
    const idTemplate = useUniqueId();
    const id = useMemo(() => {
      return outerId || `chkbx-${idTemplate}-${name || ''}`;
    }, [outerId, idTemplate]);

    return (
      <RadioWrapper styles={styles}>
        <RadioLabel disabled={disabled} invalid={invalid} htmlFor={id}>
          <RadioControl
            aria-invalid={invalid}
            defaultChecked={defaultChecked}
            checked={checked}
            disabled={disabled}
            id={id}
            name={name}
            onChange={onChange}
            onClick={e => {
              if (readOnly) {
                e.preventDefault();
              }
            }}
            onKeyDown={e => {
              if (readOnly && e.key === ' ') {
                e.preventDefault();
              }
            }}
            ref={ref}
            tabIndex={disabled ? -1 : 0}
            type="radio"
            value={value}
          />
          <Flex aria-hidden styles={togglerStyles}>
            <Svg
              viewBox="0 0 24 24"
              styles={{
                width: '1em',
                height: '1em',
              }}
            >
              <circle cx="12" cy="12" r="6" />
            </Svg>
          </Flex>
          <RadioLabelText hidden={hiddenLabel}>{label}</RadioLabelText>
        </RadioLabel>
      </RadioWrapper>
    );
  },
);
