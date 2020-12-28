import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef, ReactElement } from 'react';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';
import { Text } from './Text';
import { useUniqueId } from '../hooks';

const DividerLine = createComponent('div', {
  displayName: 'DividerLine',
  styles: props => ({
    borderWidth: 0,
    display: 'block',
    borderColor:
      'color(shades if(isDark, color(shades tint(10%)), color(shades shade(10%))))',
    borderStyle: 'solid',
    mx: 0,
    my: 0,
    ...(props.vertical
      ? { borderLeftWidth: '1px', height: '100%', minWidth: '1px' }
      : { borderBottomWidth: '1px', minHeight: '1px', width: '100%' }),
  }),
  variants: [booleanVariant('vertical', true)],
});

const DividerBase = createComponent('div', {
  displayName: 'Divider',
  styles: props => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    ...(props.vertical
      ? { flexDirection: 'column', height: '100%', maxWidth: '100%' }
      : { width: '100%' }),
  }),
  variants: [booleanVariant('vertical', true)],
});

const DividerLabel = createComponent(Text, {
  displayName: 'DividerLabel',
  styles: props => (props.vertical ? { py: 1 } : { px: 1 }),
  variants: [booleanVariant('vertical', true)],
});

interface DividerProps extends ExtractVisageComponentProps<typeof DividerBase> {
  label?: string | ReactElement | null;
  labelProps?: ExtractVisageComponentProps<typeof DividerLine>;
  lineProps?: ExtractVisageComponentProps<typeof DividerLine>;
  vertical?: boolean;
}

export const Divider = markAsVisageComponent(
  React.memo(
    forwardRef(
      (
        { label, labelProps, lineProps, vertical, ...restProps }: DividerProps,
        ref,
      ) => {
        const labelId = useUniqueId(undefined, 'divider');

        // if label is provided, split horizontal line to 2 elements
        if (!label) {
          return (
            <DividerBase
              {...restProps}
              ref={ref as any}
              role="separator"
              vertical={vertical}
            >
              <DividerLine {...lineProps} vertical={vertical} />
            </DividerBase>
          );
        }

        return (
          <DividerBase
            {...restProps}
            aria-labelledby={labelId}
            role="separator"
            ref={ref as any}
            vertical={vertical}
          >
            <DividerLine {...lineProps} vertical={vertical} />
            <DividerLabel {...labelProps} id={labelId} vertical={vertical}>
              {label}
            </DividerLabel>
            <DividerLine {...lineProps} vertical={vertical} />
          </DividerBase>
        );
      },
    ),
  ),
);
