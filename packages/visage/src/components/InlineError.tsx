import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, { forwardRef, Ref } from 'react';
import { ErrorIcon } from '../assets';
import { createComponent } from '../core';
import { Flex } from './Flex';
import { SvgIcon } from './SvgIcon';

const InlineErrorWrapper = createComponent(Flex, {
  displayName: 'InlineError',
  styles: {
    color: 'danger',
    fontSize: 0,
    lineHeight: 0,
  },
});

const InlineErrorIcon = createComponent(SvgIcon, {
  displayName: 'InlineErrorIcon',
  styles: {
    mr: 1,
  },
});

type FlexProps = ExtractVisageComponentProps<typeof Flex>;

export const InlineError: VisageComponent<FlexProps> = markAsVisageComponent(
  forwardRef(({ children, ...restProps }: FlexProps, ref: Ref<any>) => (
    <InlineErrorWrapper ref={ref} {...restProps}>
      <InlineErrorIcon icon={ErrorIcon} />
      {children}
    </InlineErrorWrapper>
  )),
) as any;
