import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import { DesignSystemContext, DesignSystemContextValue } from './context';
import { StyleSheetCreatorHook, ThemeCreator } from './types';

export interface DesignSystemState {
  is: number;
}

export type DesignSystemProps<TStylingProps, TStyleProps> = {
  children?: ReactNode;
  is: number;
  theme: ThemeCreator;
  styleSheet: StyleSheetCreatorHook<TStylingProps, TStyleProps>;
};

export interface DesignSystemComponent<TStylingProps = {}, TStyleProps = {}>
  extends FunctionComponent<DesignSystemProps<TStylingProps, TStyleProps>> {}

const DesignSystem: DesignSystemComponent = ({
  children,
  is,
  styleSheet,
  theme: createTheme,
}) => {
  const theme = useMemo(() => createTheme(is), [is]);
  const context = useMemo<DesignSystemContextValue<any, any>>(() => {
    return {
      theme,
      useStyleSheet: styleSheet(theme),
    };
  }, [is, theme, styleSheet]);

  return (
    <DesignSystemContext.Provider value={context}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export { DesignSystem };
