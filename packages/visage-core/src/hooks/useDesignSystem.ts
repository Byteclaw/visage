import { useContext } from 'react';
import { DesignSystemContext, DesignSystemContextValue } from '../context';

export function useDesignSystem<
  StylingProps = {},
  StyleProps = {}
>(): DesignSystemContextValue<StylingProps, StyleProps> {
  return useContext(DesignSystemContext);
}
