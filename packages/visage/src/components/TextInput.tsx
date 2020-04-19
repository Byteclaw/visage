import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useState,
  Ref,
  FocusEventHandler,
} from 'react';
import {
  markAsVisageComponent,
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import { createComponent } from '../core';
import {
  createControlFocusShadow,
  disabledControlStyles,
  disabledControlBooleanVariant,
  invalidControlStyles,
  invalidControlBooleanVariant,
} from './shared';

export const TextInputBaseStyles: VisageStyleSheet = {
  backgroundColor: 'color(shades tint(10%))',
  borderColor: 'color(shades shade(30%))',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: 'controlBorderRadius',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  outline: 'none',
  m: 0,
  p: 0,
  position: 'relative',
  // data-focused is used by text input on base
  '&:focus, &[data-focused="true"]': {
    boxShadow: createControlFocusShadow('accent'),
  },
};

const InputExtraElement = createComponent('div', {
  displayName: 'TextInputExtraElement',
  styles: {
    color: 'shadesText',
    display: 'flex',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    maxWidth: '100%',
    position: 'relative',
    userSelect: 'none',
    px: 1,
  },
});

const TextInputControlBase = createComponent('div', {
  displayName: 'TextInputControlBase',
  styles: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    flexWrap: 'wrap',
    width: '100%',
  },
});

const TextInputControl = createComponent('input', {
  displayName: 'TextInputControl',
  styles: {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'shadesText',
    cursor: 'inherit',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    outline: 'none',
    m: 0,
    py: 1,
    px: 1,
    width: '100%',
    '&[data-prefix]': {
      pl: 0,
    },
    '&[data-suffix]': {
      pr: 0,
    },
    '::placeholder': {
      color: 'color(shadesText alpha(0.3))',
    },
  },
});

const InputBase = createComponent('div', {
  displayName: 'TextInputBase',
  styles: props => ({
    ...TextInputBaseStyles,
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    ...(props.disabled ? disabledControlStyles : {}),
    ...(props.invalid ? invalidControlStyles : {}),
  }),
  variants: [disabledControlBooleanVariant, invalidControlBooleanVariant],
});

type InputProps = Omit<JSX.IntrinsicElements['input'], 'prefix'>;

interface TextInputProps {
  baseProps?: ExtractVisageComponentProps<typeof InputBase>;
  invalid?: boolean;
  prefix?: ReactElement;
  prefixProps?: ExtractVisageComponentProps<typeof InputExtraElement>;
  /** Elements included between prefix and input */
  prefixExtra?: ReactElement;
  suffix?: ReactElement;
  /** Elements included between input and suffix */
  suffixExtra?: ReactElement;
  suffixProps?: ExtractVisageComponentProps<typeof InputExtraElement>;
}

export const TextInput: VisageComponent<
  TextInputProps & InputProps
> = forwardRef(
  (
    {
      baseProps,
      disabled,
      invalid,
      onBlur: outerOnBlur,
      onFocus: outerOnFocus,
      prefix,
      prefixExtra,
      prefixProps,
      suffix,
      suffixExtra,
      suffixProps,
      ...restProps
    }: TextInputProps & InputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const [focused, setFocused] = useState(false);
    const onBlur: FocusEventHandler<HTMLInputElement> = useCallback(
      e => {
        setFocused(false);

        if (outerOnBlur) outerOnBlur(e);
      },
      [outerOnBlur],
    );
    const onFocus: FocusEventHandler<HTMLInputElement> = useCallback(
      e => {
        setFocused(true);

        if (outerOnFocus) outerOnFocus(e);
      },
      [outerOnFocus],
    );

    return (
      <InputBase
        {...baseProps}
        data-focused={focused}
        disabled={disabled}
        invalid={invalid}
      >
        {prefix ? (
          <InputExtraElement {...prefixProps} data-prefix>
            {prefix}
          </InputExtraElement>
        ) : null}
        <TextInputControlBase>
          {prefixExtra}
          <TextInputControl
            aria-invalid={invalid}
            data-prefix={prefix ? true : undefined}
            data-suffix={suffix ? true : undefined}
            disabled={disabled}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={ref}
            {...restProps}
          />
          {suffixExtra}
        </TextInputControlBase>
        {suffix ? (
          <InputExtraElement {...suffixProps} data-suffix>
            {suffix}
          </InputExtraElement>
        ) : null}
      </InputBase>
    );
  },
) as any;

markAsVisageComponent(TextInput);
