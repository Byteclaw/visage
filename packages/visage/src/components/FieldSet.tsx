import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import React, { ReactNode } from 'react';
import { createComponent } from '../core';
import { Heading } from './Heading';
import { visuallyHiddenStyles } from './shared';
import { booleanVariant } from '../variants';

const FieldSetLegend = createComponent('legend', {
  displayName: 'FieldSetLegend',
  styles: visuallyHiddenStyles,
});

const FieldSetHeading = createComponent(Heading, {
  displayName: 'FieldSetHeading',
  styles: {
    fontSize: 1,
    lineHeight: 1,
    fontWeight: 500,
    mt: 0,
    mb: 2,
  },
});

const FieldSetBase = createComponent('fieldset', {
  displayName: 'FieldSet',
  styles: props => ({
    borderColor: 'neutral',
    borderWidth: 1,
    my: 1,
    p: 2,
    position: 'relative',
    ...(props.flat
      ? {
          boxShadow:
            '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
        }
      : {}),
  }),
  variants: [booleanVariant('flat', true)],
});

interface FieldSetProps {
  baseProps?: ExtractVisageComponentProps<typeof FieldSetBase>;
  children: ReactNode;
  flat?: boolean;
  headingProps?: ExtractVisageComponentProps<typeof Heading>;
  title: string;
}

export function FieldSet({
  baseProps,
  children,
  flat,
  headingProps,
  title,
}: FieldSetProps) {
  return (
    <FieldSetBase {...baseProps} flat={flat}>
      <FieldSetLegend>{title}</FieldSetLegend>
      <FieldSetHeading
        level={5}
        aria-hidden
        role="presentation"
        {...headingProps}
      >
        {title}
      </FieldSetHeading>
      {children}
    </FieldSetBase>
  );
}
