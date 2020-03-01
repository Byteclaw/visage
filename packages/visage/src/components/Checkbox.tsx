import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import {
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { ReactNode, forwardRef, Ref } from 'react';
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
import { preventDefaultOnReadOnlyControlHandlerCreator } from './events';

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
  extends Omit<ExtractVisageComponentProps<typeof CheckboxControl>, 'styles'> {
  /**
   * Hides label visually
   */
  hiddenLabel?: boolean;
  /**
   * Sets the checkbox aria-invalid to true and applies visual style
   */
  invalid?: boolean;
  /**
   * Label is required to be WAI-ARIA compliant
   */
  label: ReactNode;
  /**
   * Passes props to the label
   */
  labelProps?: ExtractVisageComponentProps<typeof CheckboxLabel>;
  /**
   * Passes props to the label text
   */
  labelTextProps?: ExtractVisageComponentProps<typeof CheckboxLabelText>;
  /**
   * Toggler is the visual component that renders checkbox toggler
   * It doesn't accept any props and must return a div as root element
   * because checkbox applies styles using CSS selectors
   *
   * On Focus it applies boxShadow for focus styling to a div
   * On Invalid it applies borderColor to a div
   * On Checked
   *  - it applies backgroundColor, color and borderColor
   *  - it applies to svg element which is a direct ancestor of div a visibility visible
   * On Not Checked
   *  - it applies backgroundColor to a div
   *  - it applies to svg element which is a direct ancestor of div a visiblity hidden
   */
  toggler?: React.ComponentType<{}>;
}

export const Checkbox: VisageComponent<CheckboxProps, StyleProps> = forwardRef(
  function Checkbox(
    {
      disabled,
      hiddenLabel = false,
      invalid,
      label,
      labelProps,
      labelTextProps,
      onClick,
      onKeyDown,
      readOnly,
      toggler: Toggler = CheckboxToggler,
      ...rest
    }: CheckboxProps,
    ref: Ref<HTMLInputElement>,
  ) {
    const preventOnToggle = useStaticCallbackCreator(
      preventDefaultOnReadOnlyControlHandlerCreator,
      [readOnly, onClick, onKeyDown],
    );

    return (
      <CheckboxLabel {...labelProps} disabled={disabled}>
        <CheckboxControl
          {...rest}
          aria-invalid={invalid}
          disabled={disabled}
          onKeyDown={preventOnToggle}
          onClick={preventOnToggle}
          ref={ref}
          readOnly={readOnly}
          type="checkbox"
        />
        <Toggler />
        &#8203; {/* fixes height if label is hidden */}
        <CheckboxLabelText {...labelTextProps} hidden={hiddenLabel}>
          {label}
        </CheckboxLabelText>
      </CheckboxLabel>
    );
  },
);
