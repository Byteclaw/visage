import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React from 'react';
import { Flex } from './Flex';
import { ErrorIcon } from '../assets';
import { SvgIcon } from './SvgIcon';

export function InlineError({
  children,
  styles,
  ...restProps
}: ExtractVisageComponentProps<typeof Flex>) {
  return (
    <Flex
      styles={{ color: 'danger', fontSize: 0, lineHeight: 0, ...styles }}
      {...restProps}
    >
      <SvgIcon icon={ErrorIcon} styles={{ mr: 1 }} />
      {children}
    </Flex>
  );
}

markAsVisageComponent(InlineError);
