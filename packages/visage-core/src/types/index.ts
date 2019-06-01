import { ComponentClass, FunctionComponent } from 'react';
import { VisageComponent } from './component';
import { StylerFn, Theme } from './theme';

export * from './component';
export * from './theme';

export type ValidComponent =
  | keyof JSX.IntrinsicElements
  | FunctionComponent<any>
  | ComponentClass<any>
  | VisageComponent;

export type ExtractProps<T> = T extends VisageComponent<infer P>
  ? P
  : T extends FunctionComponent<infer P>
  ? P
  : T extends ComponentClass<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : {};

export interface StyleSheet<
  TStylingProps = { [stylePropName: string]: any },
  TStyleProps = { [key: string]: any }
> {
  flatten(): TStylingProps;
  generateStyles(): TStyleProps;
}

export interface StyleSheetHook<TStylingProps, TStyleProps> {
  (
    componentProps: {
      [key: string]: any;
      parentStyleSheet?: StyleSheet;
    } & TStylingProps,
    defaultProps?: { [key: string]: any } & TStylingProps,
    extraStylers?: {
      [key: string]: StylerFn<TStylingProps>;
    },
  ): StyleSheet<TStylingProps, TStyleProps>;
}

export interface StyleSheetCreatorHook<TStylingProps, TStyleProps> {
  (theme: Theme): StyleSheetHook<TStylingProps, TStyleProps>;
}
