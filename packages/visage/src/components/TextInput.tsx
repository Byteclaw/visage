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
    display: 'grid',
    height: '100%',
    position: 'absolute',
    py: 1,
    '& > *': {
      gridArea: '1 / 1 / 2 / 2',
    },
  },
});

const InputExtraElementContent = createComponent('div', {
  displayName: 'InputExtraElementContent',
  defaultStyles: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

const prependStyles: StyleSheet<StyleProps> = {
  left: 0,
  top: 0,
};

const appendStyles: StyleSheet<StyleProps> = {
  right: 0,
  top: 0,
};

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
        <InputExtraElement styles={prependStyles}>
          <svg viewBox="0 0 1 1" style={{ height: '100%' }} />
          <InputExtraElementContent>{prepend}</InputExtraElementContent>
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
        <InputExtraElement styles={appendStyles}>
          <svg viewBox="0 0 1 1" style={{ height: '100%' }} />
          <InputExtraElementContent>{append}</InputExtraElementContent>
        </InputExtraElement>
      ) : null}
      {extra}
    </InputBox>
  );
}
