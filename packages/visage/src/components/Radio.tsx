import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import {
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { ReactNode, forwardRef, Ref } from 'react';
import { createComponent } from '../core';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  visuallyHiddenBooleanVariant,
  visuallyHiddenStyles,
  createControlFocusShadow,
} from './shared';
import { Flex } from './Flex';
import { Svg } from './Svg';
import { preventDefaultOnReadOnlyControlHandlerCreator } from './events';

const RadioControl = createComponent('input', {
  displayName: 'RadioControl',
  styles: {
    ...visuallyHiddenStyles,
    '&:focus + div': {
      boxShadow: createControlFocusShadow(),
    },
    '& + div': {
      backgroundColor: 'textInput',
    },
    // set up color so svg has correct color
    '&:checked + div': {
      backgroundColor: 'primary',
      borderColor: 'primary',
      color: 'primaryText',
    },
    // because we want to see that input is invalid even if it's checked
    '&[aria-invalid="true"] + div': {
      borderColor: 'danger',
    },
    '&[aria-invalid="true"]:focus + div': {
      boxShadow: createControlFocusShadow('danger'),
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
  styles: props => ({
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
  styles: props => ({
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
  styles: {
    background: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    transition: 'all 150ms',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: 'accent',
    mr: 1,
  },
});

interface RadioProps extends ExtractVisageComponentProps<typeof RadioControl> {
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
  labelProps?: ExtractVisageComponentProps<typeof RadioLabel>;
  /**
   * Passes props to the label text
   */
  labelTextProps?: ExtractVisageComponentProps<typeof RadioLabelText>;
  ref?: React.RefObject<HTMLInputElement>;
  /**
   * Toggler is the visual component that renders radio toggler
   * It doesn't accept any props and must return a div as root element
   * because radio applies styles using CSS selectors
   *
   * On Focus it applies boxShadow for focus styling to a div
   * On Invalid it applies borderColor to a div
   * On Checked
   *  - it applies backgroundColor, color and borderColor
   *  - it applies to svg element which is a direct ancestor of div a visibility and fill
   * On Not Checked
   *  - it applies backgroundColor to a div
   *  - it applies to svg element which is a direct ancestor of div a visiblity hidden
   */
  toggler?: React.ComponentType<{}>;
}

export const Radio: VisageComponent<RadioProps> = forwardRef(function Radio(
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
    ...rest
  }: RadioProps,
  ref: Ref<HTMLInputElement>,
) {
  const preventOnToggle = useStaticCallbackCreator(
    preventDefaultOnReadOnlyControlHandlerCreator,
    [readOnly, onClick, onKeyDown],
  );

  return (
    <RadioLabel {...labelProps} disabled={disabled}>
      <RadioControl
        {...rest}
        aria-invalid={invalid}
        disabled={disabled}
        onClick={preventOnToggle}
        onKeyDown={preventOnToggle}
        readOnly={readOnly}
        ref={ref}
        type="radio"
      />
      <RadioToggler />
      &#8203; {/* fixes height if label is hidden */}
      <RadioLabelText {...labelTextProps} hidden={hiddenLabel}>
        {label}
      </RadioLabelText>
    </RadioLabel>
  );
});
