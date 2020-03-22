import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef } from 'react';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';
import { Text } from './Text';

const DividerLine = createComponent('div', {
  displayName: 'DividerLine',
  styles: props => ({
    borderWidth: 0,
    display: 'block',
    borderColor: 'currentColor',
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
  label?: string;
  labelProps?: ExtractVisageComponentProps<typeof DividerLine>;
  lineProps?: ExtractVisageComponentProps<typeof DividerLine>;
  vertical?: boolean;
}

export const Divider: VisageComponent<DividerProps> = React.memo(
  forwardRef(
    (
      { label, labelProps, lineProps, vertical, ...restProps }: DividerProps,
      ref,
    ) => {
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
          aria-label={label}
          role="separator"
          ref={ref as any}
          vertical={vertical}
        >
          <DividerLine {...lineProps} vertical={vertical} />
          <DividerLabel {...labelProps} role="presentation" vertical={vertical}>
            {label}
          </DividerLabel>
          <DividerLine {...lineProps} vertical={vertical} />
        </DividerBase>
      );
    },
  ),
) as any;

markAsVisageComponent(Divider);
