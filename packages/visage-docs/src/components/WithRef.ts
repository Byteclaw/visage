import { MutableRefObject, ReactNode, useRef } from 'react';

interface WithRefProps {
  children: (ref: MutableRefObject<any>) => ReactNode;
}

export function WithRef({ children }: WithRefProps) {
  const ref = useRef();

  return children(ref);
}
