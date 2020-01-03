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
import { StyleProps } from '../types';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  invalidControlStyles,
  invalidControlBooleanVariant,
} from './shared';

const InputExtraElement = createComponent('div', {
  displayName: 'InputExtraElement',
  defaultStyles: {
    color: 'currentColor',
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
  defaultStyles: {
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
  defaultStyles: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'currentColor',
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
      color: 'currentColor',
      opacity: 0.3,
    },
  },
});

const InputBase = createComponent('div', {
  displayName: 'TextInputBase',
  defaultStyles: props => ({
    alignItems: 'center',
    backgroundColor: 'textInput',
    borderColor: 'textInputBorder',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: 'controlBorderRadius',
    display: 'flex',
    fontSize: 0,
    lineHeight: 0,
    outline: '2px solid transparent',
    outlineOffset: '-2px',
    py: 0,
    px: 0,
    position: 'relative',
    flexWrap: 'wrap',
    // data-focused is used by text input on base
    '&:focus, &[data-focused="true"]': {
      outlineColor: 'darkAccent',
    },
    ...(props.disabled ? disabledControlStyles : {}),
    ...(props.invalid ? invalidControlStyles : {}),
  }),
  variants: [disabledControlBooleanVariant, invalidControlBooleanVariant],
});

// we need to override prefix so we can then override it again with correct type
interface BaseProps
  extends ExtractVisageComponentProps<typeof TextInputControl> {
  prefix?: any;
}

interface Props extends BaseProps {
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

export const TextInput: VisageComponent<Props, StyleProps> = forwardRef(
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
    }: Props,
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
