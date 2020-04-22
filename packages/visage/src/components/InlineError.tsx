import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef, Ref } from 'react';
import { ErrorIcon } from '../assets';
import { createComponent } from '../core';
import { SvgIcon } from './SvgIcon';

const InlineErrorWrapper = createComponent('div', {
  displayName: 'InlineError',
  styles: {
    color: 'danger',
    display: 'flex',
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
});

const InlineErrorIcon = createComponent(SvgIcon, {
  displayName: 'InlineErrorIcon',
  styles: {
    alignSelf: 'baseline',
    mr: 1,
  },
});

type FlexProps = ExtractVisageComponentProps<typeof InlineErrorWrapper>;

export const InlineError: VisageComponent<FlexProps> = markAsVisageComponent(
  forwardRef(({ children, ...restProps }: FlexProps, ref: Ref<any>) => (
    <InlineErrorWrapper ref={ref} {...restProps}>
      <InlineErrorIcon icon={ErrorIcon} />
      {children}
    </InlineErrorWrapper>
  )),
) as any;
