import { ReactNode, useState } from 'react';

interface WithStateProps {
  defaultValue?: any;
  children: (state: any, setState: (value: any) => void) => ReactNode;
}

export function WithState({ children, defaultValue }: WithStateProps) {
  const [value, setValue] = useState(defaultValue);

  return children(value, setValue);
}
