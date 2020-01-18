import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React from 'react';
import { createComponent } from '../core';
import { visuallyHiddenBooleanVariant, visuallyHiddenStyles } from './shared';

const RequirementDescription = createComponent('span', {
  defaultStyles: visuallyHiddenStyles,
});

const LabelBase = createComponent('label', {
  displayName: 'Label',
  defaultStyles: props => ({
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

function Label({
  children,
  required,
  requiredTitle = 'Required',
  ...restProps
}: LabelProps) {
  return (
    <LabelBase {...restProps}>
      {children}
      {required ? (
        <React.Fragment>
          <span aria-hidden>*</span>
          <RequirementDescription>{requiredTitle}</RequirementDescription>
        </React.Fragment>
      ) : null}
    </LabelBase>
  );
}

// mark as visage component, so we can passthrough outer styles
markAsVisageComponent(Label);

export { Label };
