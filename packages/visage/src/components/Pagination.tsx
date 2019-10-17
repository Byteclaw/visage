import React, { forwardRef, ReactNode, Ref } from 'react';
import {
  markAsVisageComponent,
  ExtractVisageComponentProps,
  VisageComponent,
} from '@byteclaw/visage-core';
import { PreviousPageIcon, NextPageIcon } from '../assets';
import { Button } from './Button';
import { Flex } from './Flex';
import { SvgIcon } from './SvgIcon';

interface PaginationProps extends ExtractVisageComponentProps<typeof Flex> {
  ariaLabel?: string;
  children?: ReactNode;
}

export const NextPageButton: VisageComponent<
  {},
  ExtractVisageComponentProps<typeof Button>
> = forwardRef(
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
    }: ExtractVisageComponentProps<typeof Button>,
    ref: Ref<HTMLButtonElement>,
  ) => (
    <Button type="button" ref={ref} {...props}>
      {children}
    </Button>
  ),
);

export const PreviousPageButton: VisageComponent<
  {},
  ExtractVisageComponentProps<typeof Button>
> = forwardRef(
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
    }: ExtractVisageComponentProps<typeof Button>,
    ref: Ref<HTMLButtonElement>,
  ) => (
    <Button type="button" ref={ref} {...props}>
      {children}
    </Button>
  ),
);

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

markAsVisageComponent(NextPageButton);
markAsVisageComponent(PreviousPageButton);
markAsVisageComponent(Pagination);
