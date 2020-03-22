import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React from 'react';
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

export function InlineError({
  children,
  styles,
  ...restProps
}: ExtractVisageComponentProps<typeof Flex>) {
  return (
    <InlineErrorWrapper {...restProps}>
      <InlineErrorIcon icon={ErrorIcon} />
      {children}
    </InlineErrorWrapper>
  );
}

markAsVisageComponent(InlineError);
