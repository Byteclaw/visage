import { useStaticCallbackCreator } from '@byteclaw/use-static-callback';
import {
  ExtractVisageComponentProps,
  VisageComponent,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, {
  ReactNode,
  forwardRef,
  memo,
  Ref,
  useState,
  FocusEventHandler,
} from 'react';
import { createComponent } from '../core';
import {
  visuallyHiddenStyles,
  visuallyHiddenBooleanVariant,
  disabledControlBooleanVariant,
  disabledControlStyles,
  createControlFocusShadow,
} from './shared';
import { Flex } from './Flex';
import { Svg } from './Svg';
import { booleanVariant, booleanVariantStyles } from '../variants';
import { useComposedCallbackCreator, useHandlerRef } from '../hooks';
import { wrapToggleOnChangeHandler } from './events';

const CheckboxControl = createComponent('input', {
  displayName: 'CheckboxControl',
  styles: {
    ...visuallyHiddenStyles,
  },
});

const CheckboxLabel = createComponent('label', {
  displayName: 'CheckboxLabel',
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

const CheckboxLabelText = createComponent('span', {
  displayName: 'CheckboxLabelText',
  styles: props => ({
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
          stroke: 'color(shades tint(10%))',
          strokeWidth: '2px',
          fill: 'none',
        }}
      >
        <polyline points="20 6 9 17 4 12" />
      </Svg>
    ),
  },
  styles: {
    backgroundColor: 'color(shades tint(10%))',
    alignSelf: 'center',
    transition: 'all 150ms',
    borderColor: 'accent',
    borderRadius: '3px',
    borderStyle: 'solid',
    borderWidth: '2px',
    mr: 1,
    ...booleanVariantStyles('checked', {
      on: {
        backgroundColor: 'primary',
        color: 'primaryText',
        borderColor: 'primary',
        '& > svg': {
          visibility: 'visible',
        },
      },
      off: {
        '& > svg': {
          visibility: 'hidden',
        },
      },
    }),
    ...booleanVariantStyles('invalid', {
      on: {
        borderColor: 'danger',
        ...booleanVariantStyles('focused', {
          on: {
            boxShadow: createControlFocusShadow('danger'),
          },
        }),
      },
      off: booleanVariantStyles('focused', {
        on: {
          boxShadow: createControlFocusShadow(),
        },
      }),
    }),
  },
  variants: [
    booleanVariant('checked', true),
    booleanVariant('disabled', true),
    booleanVariant('invalid', true),
    booleanVariant('focused', true),
    booleanVariant('readOnly', true),
  ],
});

interface TogglerProps {
  checked: boolean;
  disabled?: boolean;
  focused: boolean;
  invalid?: boolean;
  readOnly?: boolean;
}

const DefaultCheckboxToggler = memo((props: TogglerProps) => {
  return <CheckboxToggler {...props} />;
});

interface CheckboxProps
  extends ExtractVisageComponentProps<typeof CheckboxControl> {
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
  ref?: React.RefObject<HTMLInputElement>;
  /**
   * Toggler componet
   */
  toggler?: React.ComponentType<TogglerProps>;
}

export const Checkbox: VisageComponent<CheckboxProps> = memo(
  forwardRef(function Checkbox(
    {
      $$variants,
      checked,
      defaultChecked,
      disabled,
      hiddenLabel = false,
      invalid,
      label,
      labelProps,
      labelTextProps,
      onBlur,
      onFocus,
      onChange,
      parentStyles,
      readOnly,
      styles,
      toggler: Toggler = DefaultCheckboxToggler,
      ...rest
    }: CheckboxProps,
    ref: Ref<HTMLInputElement>,
  ) {
    const [focused, setFocused] = useState(false);
    const [innerChecked, setInnerChecked] = useState(
      checked ?? defaultChecked ?? false,
    );
    const onInnerBlur = useHandlerRef(() => setFocused(false));
    const onInnerFocus = useHandlerRef(() => setFocused(true));
    const onBlurHandler = useComposedCallbackCreator<FocusEventHandler>(
      onBlur,
      onInnerBlur,
    );
    const onFocusHandler = useComposedCallbackCreator<FocusEventHandler>(
      onFocus,
      onInnerFocus,
    );
    const onChangeHandler = useStaticCallbackCreator(
      wrapToggleOnChangeHandler,
      [readOnly, onChange, setInnerChecked],
    );
    // if onChange is provided then the component is controlled
    const isChecked = onChange ? checked ?? false : innerChecked;

    return (
      <CheckboxLabel
        {...labelProps}
        disabled={disabled}
        parentStyles={parentStyles}
        styles={styles}
        $$variants={$$variants}
      >
        <CheckboxControl
          {...rest}
          checked={isChecked}
          aria-invalid={invalid}
          disabled={disabled}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          onFocus={onFocusHandler}
          ref={ref}
          readOnly={readOnly}
          type="checkbox"
        />
        <Toggler
          checked={isChecked}
          disabled={disabled}
          focused={focused}
          invalid={invalid}
          readOnly={readOnly}
        />
        &#8203; {/* fixes height if label is hidden */}
        <CheckboxLabelText {...labelTextProps} hidden={hiddenLabel}>
          {label}
        </CheckboxLabelText>
      </CheckboxLabel>
    );
  }),
);

markAsVisageComponent(Checkbox);
