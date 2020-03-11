import React from 'react';
import { useBreakpoint } from './useBreakpointManager';

interface IsBreakpointProps {
  children?: React.ReactNode | (() => React.ReactNode);
  gte?: number;
  is?: number | number[];
  lte?: number;
  not?: number | number[];
}

export function IsBreakpoint({ children, ...restProps }: IsBreakpointProps) {
  const shouldRender = useBreakpoint(restProps);

  if (shouldRender) {
    return typeof children === 'function' ? children() : children;
  }

  return null;
}
