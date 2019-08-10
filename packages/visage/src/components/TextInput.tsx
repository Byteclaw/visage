import React, {
  forwardRef,
  ReactElement,
  ReactNode,
  useMemo,
  Ref,
} from 'react';
import {
  markAsVisageComponent,
  StyleSheet,
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import { createComponent } from '../core';
import { StyleProps } from '../createNPointTheme';
import { disabledControl, invalidControl } from './shared';

const InputExtraElement = createComponent('div', {
  displayName: 'InputExtraElement',
  defaultStyles: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
  },
});

const TextInputBase = createComponent('input', {
  displayName: 'TextInputBaseInput',
  defaultStyles: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: '1px',
    background: 'none',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    outline: '2px solid transparent',
    outlineOffset: '-2px',
    m: 0,
    py: 1,
    px: 2,
    width: '100%',
  },
});

const InputBase = invalidControl(disabledControl(TextInputBase));

const inputBoxDefaultStyles: StyleSheet<StyleProps> = {
  border: 'none',
  fontSize: 0,
  lineHeight: 0,
  display: 'inline-flex',
  position: 'relative',
};

const InputBox = createComponent('div', {
  displayName: 'TextInputBox',
  defaultStyles: inputBoxDefaultStyles,
});

interface Props extends ExtractVisageComponentProps<typeof TextInputBase> {
  append?: ReactElement;
  disabled?: boolean;
  invalid?: boolean;
  prepend?: ReactElement;
  extra?: ReactNode;
}

export const TextInput: VisageComponent<Props, StyleProps> = forwardRef(
  (
    {
      append,
      disabled,
      prepend,
      extra,
      styles: outerStyles,
      invalid,
      ...restProps
    }: Props,
    ref: Ref<HTMLInputElement>,
  ) => {
    const styles = useMemo(() => {
      const lineHeight =
        outerStyles && outerStyles.lineHeight != null
          ? outerStyles.lineHeight
          : inputBoxDefaultStyles.lineHeight;

      return {
        lineHeight,
        ...outerStyles,
      };
    }, [outerStyles, prepend, append]);

    return (
      <InputBox styles={styles}>
        {prepend ? (
          <InputExtraElement
            styles={{ left: 0, linedWidth: styles.lineHeight }}
          >
            {prepend}
          </InputExtraElement>
        ) : null}
        <InputBase
          disabled={disabled}
          invalid={invalid}
          ref={ref}
          styles={{
            plOffset: prepend ? styles.lineHeight : undefined,
            prOffset: append ? styles.lineHeight : undefined,
          }}
          {...restProps}
        />
        {append ? (
          <InputExtraElement
            styles={{ linedWidth: styles.lineHeight, right: 0 }}
          >
            {append}
          </InputExtraElement>
        ) : null}
        {extra}
      </InputBox>
    );
  },
) as any;

markAsVisageComponent(TextInput);
