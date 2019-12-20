import { markAsVisageComponent, VisageComponent } from '@byteclaw/visage-core';
import React, { ReactNode } from 'react';
import { Flex } from './Flex';
import { ErrorIcon } from '../assets';
import { SvgIcon } from './SvgIcon';
import { StyleProps } from '../types';

interface InlineErrorProps {
  children: ReactNode;
}

export const InlineError: VisageComponent<InlineErrorProps, StyleProps> = ({
  children,
  ...restProps
}: InlineErrorProps) => {
  return (
    <Flex
      {...restProps}
      styles={{ color: 'danger', fontSize: 0, lineHeight: 0 }}
    >
      <SvgIcon icon={ErrorIcon} styles={{ mr: 1 }} />
      {children}
    </Flex>
  );
};

InlineError.displayName = 'InlineError';

markAsVisageComponent(InlineError);
