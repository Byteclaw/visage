import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef } from 'react';
import { createComponent } from '../core';
import { booleanVariant, booleanVariantStyles } from '../variants';
import { Text } from './Text';
import { StyleProps } from '../createNPointTheme';

const DividerLine = createComponent('div', {
  displayName: 'DividerLine',
  defaultStyles: {
    borderWidth: 0,
    display: 'block',
    borderColor: 'currentColor',
    borderStyle: 'solid',
    mx: 0,
    my: 0,
    ...booleanVariantStyles('vertical', {
      on: {
        borderLeftWidth: '1px',
        height: '100%',
        minWidth: '1px',
      },
      off: {
        borderBottomWidth: '1px',
        minHeight: '1px',
        width: '100%',
      },
    }),
  },
  variants: [booleanVariant('vertical', true)],
});

const DividerBase = createComponent('div', {
  displayName: 'Divider',
  defaultStyles: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    ...booleanVariantStyles('vertical', {
      on: {
        flexDirection: 'column',
        height: '100%',
        maxWidth: '100%',
      },
      off: {
        width: '100%',
      },
    }),
  },
  variants: [booleanVariant('vertical', true)],
});

const DividerLabel = createComponent(Text, {
  displayName: 'DividerLabel',
  defaultStyles: {
    ...booleanVariantStyles('vertical', {
      on: {
        py: 1,
      },
      off: {
        px: 1,
      },
    }),
  },
  variants: [booleanVariant('vertical', true)],
});

interface DividerProps extends ExtractVisageComponentProps<typeof DividerBase> {
  label?: string;
  labelProps?: ExtractVisageComponentProps<typeof DividerLine>;
  lineProps?: ExtractVisageComponentProps<typeof DividerLine>;
  vertical?: boolean;
}

export const Divider: VisageComponent<DividerProps, StyleProps> = forwardRef(
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
) as any;

markAsVisageComponent(Divider);
