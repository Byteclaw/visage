import React from 'react';
import { useDesignSystem } from './hooks';

interface IsBreakpointProps {
  children?: React.ReactNode | (() => React.ReactNode);
  gte?: number;
  is?: number | number[];
  lte?: number;
  not?: number | number[];
}

export function IsBreakpoint({
  children,
  gte,
  is,
  lte,
  not,
}: IsBreakpointProps) {
  const visage = useDesignSystem();
  const renderedChildren = React.useMemo(() => {
    // now check the breakpoints, basically start with more precise breakpoints
    let isMatch = false;

    if (is != null) {
      isMatch =
        is === visage.breakpoint ||
        (Array.isArray(is) && is.indexOf(visage.breakpoint) !== -1);
    } else if (not != null) {
      isMatch = Array.isArray(not)
        ? not.indexOf(visage.breakpoint) === -1
        : not !== visage.breakpoint;
    } else if (gte != null) {
      isMatch = visage.breakpoint >= gte;
    } else if (lte != null) {
      isMatch = visage.breakpoint <= lte;
    }

    if (isMatch) {
      return typeof children === 'function' ? children() : children;
    }

    return null;
  }, [visage, children, gte, is, lte, not]);

  return React.createElement(React.Fragment, {}, renderedChildren);
}
