import {
  VisageComponent,
  StyleProps as VisageStyleProps,
} from '@byteclaw/visage-core';
import React, { ReactElement, ReactNode, ChangeEventHandler } from 'react';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
import {
  visuallyHiddenStripped,
  visuallyHiddenStyles,
  disabledControl,
  invalidControl,
} from './shared';

const CheckboxControl = createComponent('input', {
  displayName: 'CheckboxControl',
  defaultStyles: {
    ...visuallyHiddenStyles,
    // prevent blinking when clicking on already focused checkbox
    '&:focus + label::before, &:active:not([disabled]) + label::before': {
      borderColor: 'blue',
      borderWidth: '2px',
    },
    '&:checked + label::after': {
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

const CheckboxLabel = disabledControl(
  invalidControl(
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

const CheckboxLabelText = visuallyHiddenStripped(
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
  id?: string;
  invalid?: boolean;
  label: ReactNode;
  /**
   * Name is required for proper control id
   * If name is not unique, use id
   */
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  value?: any;
  wrapper?: ReactElement;
}

export const Checkbox: VisageComponent<
  CheckboxProps,
  StyleProps
> = function Checkbox({
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
}: CheckboxProps) {
  const id = `chkbx-${outerId || ''}${name}`;

  return (
    <CheckboxWrapper styles={styles}>
      <CheckboxControl
        aria-invalid={invalid}
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
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
        readOnly={readOnly}
        tabIndex={0}
        type="checkbox"
        value={value}
      />
      <CheckboxLabel invalid={invalid} disabled={disabled} htmlFor={id}>
        <CheckboxLabelText hidden={hiddenLabel}>{label}</CheckboxLabelText>
      </CheckboxLabel>
    </CheckboxWrapper>
  );
};
