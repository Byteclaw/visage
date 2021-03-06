import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React from 'react';
import { createComponent } from '../core';
import { visuallyHiddenBooleanVariant, visuallyHiddenStyles } from './shared';

const RequirementDescription = createComponent('span', {
  displayName: 'LabelRequirementDescription',
  defaultStyles: visuallyHiddenStyles,
});

const LabelBase = createComponent('label', {
  displayName: 'Label',
  styles: props => ({
    display: 'block',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    m: 0,
    mb: 1,
    p: 0,
    verticalAlign: 'middle',
    ...(props.hidden ? visuallyHiddenStyles : {}),
  }),
  variants: [visuallyHiddenBooleanVariant],
});

interface LabelProps extends ExtractVisageComponentProps<typeof LabelBase> {
  required?: boolean;
  /**
   * Title used to describe what asterisk means, default is Required
   */
  requiredTitle?: string;
}

export const Label = markAsVisageComponent(function Label({
  children,
  required,
  requiredTitle = 'Required',
  ...restProps
}: LabelProps) {
  return (
    <LabelBase {...restProps}>
      {children}
      {required ? (
        <>
          <span aria-hidden>*</span>
          <RequirementDescription>{requiredTitle}</RequirementDescription>
        </>
      ) : null}
    </LabelBase>
  );
});
