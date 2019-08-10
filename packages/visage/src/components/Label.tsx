import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, { Fragment } from 'react';
import { createComponent } from '../core';
import { visuallyHiddenNonStripped, visuallyHiddenStyles } from './shared';

const RequirementDescription = createComponent('span', {
  defaultStyles: visuallyHiddenStyles,
});

const LabelBase = createComponent('label', {
  displayName: 'Label',
  defaultStyles: {
    fontSize: 0,
    lineHeight: 0,
    verticalAlign: 'middle',
  },
});

const Comp = visuallyHiddenNonStripped(LabelBase);

interface LabelProps extends ExtractVisageComponentProps<typeof Comp> {
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
    <Comp {...restProps}>
      {children}
      {required ? (
        <Fragment>
          <span aria-hidden>*</span>
          <RequirementDescription>{requiredTitle}</RequirementDescription>
        </Fragment>
      ) : null}
    </Comp>
  );
}

// mark as visage component, so we can passthrough outer styles
markAsVisageComponent(Label);

export { Label };
