import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import React, { Fragment, ReactNode } from 'react';
import { createBooleanVariant, createComponent } from '../core';
import { Heading } from './Heading';
import { visuallyHiddenStyles } from './shared';

const FieldSetLegend = createComponent('legend', {
  displayName: 'FieldSetLegend',
  defaultStyles: visuallyHiddenStyles,
});

const FieldSetBase = createBooleanVariant('flat', {
  onStyles: {},
  offStyles: {
    boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.15)',
  },
  stripProp: true,
})(
  createComponent('fieldset', {
    displayName: 'FieldSet',
    defaultStyles: {
      borderColor: 'neutral',
      borderWidth: 1,
      my: 1,
      p: 2,
      position: 'relative',
    },
  }),
);

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
      <Fragment>
        <FieldSetLegend>{title}</FieldSetLegend>
        <Heading
          aria-hidden
          role="presentation"
          styles={{
            fontSize: 1,
            lineHeight: 1,
            fontWeight: 500,
            m: 0,
            mb: 2,
            p: 0,
          }}
          {...headingProps}
        >
          {title}
        </Heading>
      </Fragment>
      {children}
    </FieldSetBase>
  );
}
