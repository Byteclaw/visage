import React, { forwardRef } from 'react';
import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import { Button } from './Button';
import { NextPageIcon } from '../assets';
import { SvgIcon } from './SvgIcon';

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
    }: ExtractVisageComponentProps<typeof Button>,
    ref: any,
  ) => (
    <Button type="button" ref={ref} {...props}>
      {children}
    </Button>
  ),
) as any;

export const PreviousPageButton = () => null;

export const Pagination = ({ children }: any) => <div>{children}</div>;
