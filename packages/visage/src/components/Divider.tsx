import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef } from 'react';
import { createComponent, createBooleanVariant } from '../core';
import { Text } from './Text';
import { StyleProps } from '../createNPointTheme';

const verticalLineVariant = createBooleanVariant('vertical', {
  onStyles: {
    borderLeftWidth: '2px',
    height: '100%',
    minWidth: '2px',
  },
  offStyles: {
    borderBottomWidth: '2px',
    minHeight: '2px',
    width: '100%',
  },
  stripProp: true,
});

const verticalBaseVariant = createBooleanVariant('vertical', {
  onStyles: {
    flexDirection: 'column',
    height: '100%',
    maxWidth: '100%',
  },
  offStyles: {
    width: '100%',
  },
  stripProp: true,
});

const verticalLabelVariant = createBooleanVariant('vertical', {
  onStyles: {
    py: 1,
  },
  offStyles: {
    px: 1,
  },
  stripProp: true,
});

const DividerLine = verticalLineVariant(
  createComponent('div', {
    displayName: 'DividerLine',
    defaultStyles: {
      borderWidth: 0,
      display: 'block',
      borderColor: 'grey.4',
      borderStyle: 'solid',
      mx: 0,
      my: 0,
    },
  }),
);

const DividerBase = verticalBaseVariant(
  createComponent('div', {
    displayName: 'DividerBase',
    defaultStyles: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
  }),
);

const DividerLabel = verticalLabelVariant(
  createComponent(Text, {
    displayName: 'DividerLabel',
    defaultStyles: {},
  }),
);

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
