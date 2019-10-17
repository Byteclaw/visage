import React from 'react';
import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import { Button } from './Button';

export function NextPageButton({
  children,
  ...props
}: ExtractVisageComponentProps<typeof Button>) {
  return (
    <Button type="button" {...props}>
      {children}
    </Button>
  );
}

export const PreviousPageButton = () => null;

export const Pagination = ({ children }: any) => <div>{children}</div>;
