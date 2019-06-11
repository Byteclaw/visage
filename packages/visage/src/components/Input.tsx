import React, {
  ReactElement,
  ReactNode,
  ComponentPropsWithRef,
  useMemo,
} from 'react';
import { StyleSheet } from '@byteclaw/visage-core';
import { createComponent } from '../core';
import { Box } from './Box';
import { StyleProps } from '../createNPointTheme';

const InputBase = createComponent('input', {
  displayName: 'InputBase',
  defaultStyles: {
    borderWidth: 0,
    background: 'inherit',
    color: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    m: 0,
    p: 0,
    height: '100%',
    width: '100%',
  },
});

const inputBoxDefaultStyles: StyleSheet<StyleProps> = {
  fontSize: 0,
  lineHeight: 0,
  display: 'inline-flex',
  position: 'relative',
};

const InputBox = createComponent(Box, {
  displayName: 'InputBox',
  defaultStyles: inputBoxDefaultStyles,
});

interface Props extends ComponentPropsWithRef<typeof InputBase> {
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  extra?: ReactNode;
}

export function Input({
  leftIcon,
  rightIcon,
  extra,
  styles: outerStyles,
  ...restProps
}: Props) {
  const styles = useMemo(() => {
    const lineHeight =
      outerStyles && outerStyles.lineHeight != null
        ? outerStyles.lineHeight
        : inputBoxDefaultStyles.lineHeight;

    return {
      lineHeight,
      linedHeight: lineHeight,
      ...outerStyles,
    };
  }, [outerStyles, leftIcon, rightIcon]);

  return (
    <InputBox styles={styles}>
      {leftIcon ? (
        <Box
          styles={{
            lineHeight: 'inherit',
            top: 0,
            left: 0,
            height: '100%',
            position: 'absolute',
            linedWidth: styles.linedHeight,
          }}
        >
          {leftIcon}
        </Box>
      ) : null}
      <InputBase
        styles={{
          plOffset: leftIcon ? styles.lineHeight : undefined,
          prOffset: rightIcon ? styles.lineHeight : undefined,
        }}
        {...restProps}
      />
      {rightIcon ? (
        <Box
          styles={{
            lineHeight: 'inherit',
            top: 0,
            right: 0,
            height: '100%',
            position: 'absolute',
            linedWidth: styles.linedHeight,
          }}
        >
          {rightIcon}
        </Box>
      ) : null}
      {extra}
    </InputBox>
  );
}
