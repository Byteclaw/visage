import { createContext } from 'react';
import { StyleSheetHook, Theme } from './types';

export interface DesignSystemContextValue<TStylingProps, TStyleProps> {
  theme: Theme;
  useStyleSheet: StyleSheetHook<TStylingProps, TStyleProps>;
}

export const DesignSystemContext = createContext<
  DesignSystemContextValue<any, any>
>({} as any);
