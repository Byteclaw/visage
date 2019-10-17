import React, { forwardRef } from 'react';
import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import { PreviousPageIcon, NextPageIcon } from '../assets';
import { Button } from './Button';
import { Flex } from './Flex';
import { SvgIcon } from './SvgIcon';

interface PaginationProps extends ExtractVisageComponentProps<typeof Flex> {
  ariaLabel?: string;
}

export const NextPageButton: typeof Button = forwardRef(
  (
    {
      children = (
        <SvgIcon
          aria-hidden
          focusable={false}
          icon={NextPageIcon}
          styles={{ width: '1em', height: '1em' }}
        />
      ),
      ...props
    }: any,
    ref: any,
  ) => (
    <Button type="button" ref={ref} {...props}>
      {children}
    </Button>
  ),
) as any;

export const PreviousPageButton: typeof Button = forwardRef(
  (
    {
      children = (
        <SvgIcon
          aria-hidden
          focusable={false}
          icon={PreviousPageIcon}
          styles={{ width: '1em', height: '1em' }}
        />
      ),
      ...props
    }: any,
    ref: any,
  ) => (
    <Button type="button" ref={ref} {...props}>
      {children}
    </Button>
  ),
) as any;

export const Pagination: typeof Flex = ({
  ariaLabel = 'pagination',
  children,
  styles,
  ...props
}: PaginationProps) => (
  <Flex
    aria-label={ariaLabel}
    as="nav"
    styles={{ justifyContent: 'flex-start', ...styles }}
    {...props}
  >
    {children}
  </Flex>
);
