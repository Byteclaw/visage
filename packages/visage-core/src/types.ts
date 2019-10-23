import React, { ComponentProps } from 'react';

export interface Visage<TTheme extends Theme> {
  breakpoint: number;
  face(componentName: string): StyleSheet<any>;
  generate(styleSheet: StyleSheet<any>): { [prop: string]: any };
  resolveStyle(
    prop: string,
    value:
      | string
      | number
      | null
      | undefined
      | (string | number | null | undefined)[],
  ): string | number | null | undefined;
  theme: TTheme;
}

export interface ValidStyleSheet {
  [key: string]: any;
}

type MakeResponsiveStyleSheet<TStyleSheet extends ValidStyleSheet> = {
  [K in keyof TStyleSheet]:
    | TStyleSheet[K]
    | null
    | undefined
    | (string | number | null | undefined | TStyleSheet[K])[];
};

export type StyleSheet<
  TStyleSheet extends ValidStyleSheet
> = MakeResponsiveStyleSheet<TStyleSheet> & {
  [pseudo: string]:
    | string
    | number
    | null
    | undefined
    | (string | number | null | undefined)[]
    | MakeResponsiveStyleSheet<TStyleSheet>;
};

export interface StyleProps<TStyleSheet extends ValidStyleSheet = {}> {
  styles?: StyleSheet<TStyleSheet>;
  parentStyles?: StyleSheet<TStyleSheet>;
}

export interface StyleGenerator {
  (styleSheet: ResolvedStyleSheet): { [prop: string]: any };
}

export interface Theme {
  resolve(
    propName: string,
    propValue: any,
    breakpoint: number,
  ): { value: any; properties: string[] };
}

export interface ResolvedStyleSheet {
  [propOrPseudo: string]:
    | string
    | null
    | undefined
    | number
    | {
        [prop: string]: string | null | undefined | number;
      };
}

export type ComponentConstraint =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type ExtractVisageComponentProps<
  T extends ComponentConstraint
> = T extends VisageComponent<infer P, infer S>
  ? P & StyleProps<S>
  : ComponentProps<T>;

export type OmittableProps<T extends {}> = {
  [K in keyof T]?: undefined | T[K];
};

export interface VisageComponent<
  TComponentProps,
  TStyleSheet extends ValidStyleSheet
> {
  displayName?: string;
  <
    C extends undefined | ComponentConstraint,
    P = C extends ComponentConstraint ? ExtractVisageComponentProps<C> : {}
  >(
    props: { as?: C } & StyleProps<TStyleSheet> & TComponentProps & P,
  ): React.ReactElement | null;
}

type UnionToIntersection<U> = (U extends any
  ? ((k: U) => void)
  : never) extends ((k: infer I) => void)
  ? I
  : never;

export interface ComponentFactory<TStyleSheet extends ValidStyleSheet> {
  <
    TDefaultComponent extends ComponentConstraint,
    TVariantsProps extends any[] | undefined = undefined
  >(
    as: TDefaultComponent,
    options?: {
      displayName?: string;
      defaultProps?: ExtractVisageComponentProps<TDefaultComponent> &
        (TVariantsProps extends Array<infer P> ? P : {});
      defaultStyles?: StyleSheet<TStyleSheet>;
      variants?: TVariantsProps;
    },
  ): VisageComponent<
    React.ComponentProps<TDefaultComponent> &
      (TVariantsProps extends Array<infer P> ? UnionToIntersection<P> : {}),
    TStyleSheet
  >;
}

export interface UseDesignSystemHookOptions<TTheme extends Theme = Theme> {
  is?: number;
  faces?: { [componenName: string]: undefined | StyleSheet<any> };
  styleGenerator: StyleGenerator;
  theme: TTheme;
}

export interface UseDesignSystemHook<TTheme extends Theme = Theme> {
  (options?: UseDesignSystemHookOptions<TTheme>): Visage<TTheme>;
}

export interface UseVisageHookOptions<TStyleSheet extends ValidStyleSheet> {
  as: any;
  componentName: string;
  defaultStyles?: StyleSheet<TStyleSheet>;
  variants?: {
    name: string;
    stripProp: boolean;
    defaultValue: string | boolean;
  }[];
}

export interface UseVisageHook<
  TStyleSheet extends ValidStyleSheet,
  TOutputProps extends { [prop: string]: any } = { [prop: string]: any }
> {
  (
    props: StyleProps<TStyleSheet>,
    options: UseVisageHookOptions<TStyleSheet>,
  ): TOutputProps;
}
