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
  disabledControlStyles,
  visuallyHiddenBooleanVariant,
  visuallyHiddenStyles,
  createControlFocusShadow,
} from './shared';
import { Flex } from './Flex';
import { Svg } from './Svg';
import { booleanVariant, booleanVariantStyles } from '../variants';
import { useHandlerRef, useCombinedRef, useStaticEffect } from '../hooks';
import { useComposedCallbackCreator } from '../hooks/useComposedCallback';
import { detectRadioCheckedState } from './effects';
import { wrapToggleOnChangeHandler } from './events';

const RadioControl = createComponent('input', {
  displayName: 'RadioControl',
  styles: visuallyHiddenStyles,
});

const RadioLabel = createComponent('label', {
  displayName: 'RadioLabel',
  styles: {
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
    ...booleanVariantStyles('disabled', {
      on: disabledControlStyles,
    }),
    ...booleanVariantStyles('readOnly', {
      on: {
        cursor: 'default',
      },
    }),
  },
  variants: [
    booleanVariant('disabled', true),
    booleanVariant('readOnly', true),
  ],
});

const RadioLabelText = createComponent('span', {
  displayName: 'RadioLabelText',
  styles: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    ...booleanVariantStyles('hidden', {
      on: visuallyHiddenStyles,
    }),
  },
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
    backgroundColor: 'color(shades tint(10%))',
    alignSelf: 'center',
    transition: 'all 150ms',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: 'accent',
    mr: 1,
    ...booleanVariantStyles('checked', {
      on: {
        backgroundColor: 'primary',
        color: 'primaryText',
        borderColor: 'primary',
        '& > svg': {
          fill: 'color(shades tint(10%))',
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

export interface RadioTogglerProps {
  checked: boolean;
  disabled?: boolean;
  focused: boolean;
  invalid?: boolean;
  readOnly?: boolean;
}

const DefaultRadioToggler = memo((props: RadioTogglerProps) => {
  return <RadioToggler {...props} />;
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
   * Toggler component
   */
  toggler?: React.ComponentType<RadioTogglerProps>;
}

export const Radio: VisageComponent<RadioProps> = forwardRef(function Radio(
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
    name,
    onBlur,
    onChange,
    onFocus,
    readOnly,
    parentStyles,
    styles,
    toggler: Toggler = DefaultRadioToggler,
    ...rest
  }: RadioProps,
  ref: Ref<HTMLInputElement>,
) {
  const reff = useCombinedRef(ref);
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
  const onChangeHandler = useStaticCallbackCreator(wrapToggleOnChangeHandler, [
    readOnly,
    onChange,
    setInnerChecked,
  ]);
  // if checked is provided then the component is controlled
  const isChecked = checked ?? innerChecked;
  const isControlled = checked != null;

  useStaticEffect(
    detectRadioCheckedState,
    reff,
    isControlled,
    !!readOnly,
    setInnerChecked,
  );

  // find out how uncontrolled components can be handled with onChange, especially radio which
  // fires only on change on a specific component, so the previous one does not react at all
  return (
    <RadioLabel
      {...labelProps}
      disabled={disabled}
      parentStyles={parentStyles}
      readOnly={readOnly}
      styles={styles}
      $$variants={$$variants}
    >
      <RadioControl
        {...rest}
        aria-invalid={invalid}
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        name={name}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        onFocus={onFocusHandler}
        ref={reff}
        readOnly={readOnly}
        type="radio"
      />
      <Toggler
        checked={isChecked}
        disabled={disabled}
        focused={focused}
        invalid={invalid}
        readOnly={readOnly}
      />
      &#8203; {/* fixes height if label is hidden */}
      <RadioLabelText {...labelTextProps} hidden={hiddenLabel}>
        {label}
      </RadioLabelText>
    </RadioLabel>
  );
});

markAsVisageComponent(Radio);
