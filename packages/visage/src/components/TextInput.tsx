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
import { StyleProps } from '../createNPointTheme';
import { disabledControlStripped, invalidControl } from './shared';

const InputExtraElement = createComponent('div', {
  displayName: 'InputExtraElement',
  defaultStyles: {
    color: 'currentColor',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    position: 'relative',
    userSelect: 'none',
    px: 1,
    '&[data-suffix]': {
      pl: 0,
    },
    '&[data-prefix]': {
      pr: 0,
    },
  },
});

const TextInputControl = createComponent('input', {
  displayName: 'TextInputControl',
  defaultStyles: {
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
    py: 0,
    px: 1,
    width: '100%',
  },
});

const InputBase = invalidControl(
  disabledControlStripped(
    createComponent('div', {
      displayName: 'TextInputBase',
      defaultStyles: {
        alignItems: 'center',
        background: 'none',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        display: 'flex',
        fontSize: 0,
        lineHeight: 0,
        outline: '2px solid transparent',
        outlineOffset: '-2px',
        py: 1,
        px: 0,
        position: 'relative',
      },
    }),
  ),
);

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
  suffix?: ReactElement;
  suffixProps?: ExtractVisageComponentProps<typeof InputExtraElement>;
}

export const TextInput: VisageComponent<Props, StyleProps> = forwardRef(
  (
    {
      baseProps,
      disabled,
      prepend,
      invalid,
      onBlur: outerOnBlur,
      onFocus: outerOnFocus,
      prefix,
      prefixProps,
      suffix,
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
        <TextInputControl
          aria-invalid={invalid}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={ref}
          {...restProps}
        />
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
