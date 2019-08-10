import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, { ChangeEventHandler, ReactElement, ReactNode } from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
import {
  disabledControl,
  invalidControl,
  visuallyHiddenStripped,
  visuallyHiddenStyles,
} from './shared';

const RadioControl = createComponent('input', {
  displayName: 'RadioControl',
  defaultStyles: {
    ...visuallyHiddenStyles,
    // prevent blinking when clicking on already focused radio
    '&:focus + label::before, &:active:not([disabled]) + label::before': {
      borderColor: 'blue',
      borderWidth: '2px',
    },
    '&:checked + label::after': {
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

const RadioLabel = disabledControl(
  invalidControl(
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
  /**
   * Id is required for a group
   */
  id: string;
  invalid?: boolean;
  label: ReactNode;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  value: any;
  wrapper?: ReactElement;
}

export const Radio: VisageComponent<RadioProps, StyleProps> = function Radio({
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
}: RadioProps) {
  const id = `radio-${outerId || ''}${name}`;

  return (
    <RadioWrapper styles={styles}>
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
        tabIndex={disabled ? -1 : 0}
        type="radio"
        value={value}
      />
      <RadioLabel disabled={disabled} invalid={invalid} htmlFor={id}>
        <RadioLabelText hidden={hiddenLabel}>{label}</RadioLabelText>
      </RadioLabel>
    </RadioWrapper>
  );
};
