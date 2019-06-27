import React, {
  ReactElement,
  ReactNode,
  ComponentPropsWithRef,
  useMemo,
} from 'react';
import { StyleSheet } from '@byteclaw/visage-core';
import { createComponent, createVariant } from '../core';
import { StyleProps } from '../createNPointTheme';

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

const InputBase = createVariant(
  createComponent('input', {
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
  }),
  'variant',
  {
    invalid: {
      borderColor: 'red',
      borderWidth: '2px',
      focus: {
        outlineColor: 'red',
      },
    },
    default: {
      focus: {
        outlineColor: 'blue',
      },
    },
  },
);

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

interface Props extends ComponentPropsWithRef<typeof InputBase> {
  append?: ReactElement;
  prepend?: ReactElement;
  extra?: ReactNode;
  invalid?: boolean;
}

export function TextInput({
  append,
  prepend,
  extra,
  styles: outerStyles,
  invalid,
  ...restProps
}: Props) {
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
    <InputBox>
      {prepend ? (
        <InputExtraElement styles={{ left: 0, linedWidth: styles.lineHeight }}>
          {prepend}
        </InputExtraElement>
      ) : null}
      <InputBase
        styles={{
          plOffset: prepend ? styles.lineHeight : undefined,
          prOffset: append ? styles.lineHeight : undefined,
        }}
        variant={invalid ? 'invalid' : undefined}
        {...restProps}
      />
      {append ? (
        <InputExtraElement styles={{ linedWidth: styles.lineHeight, right: 0 }}>
          {append}
        </InputExtraElement>
      ) : null}
      {extra}
    </InputBox>
  );
}
