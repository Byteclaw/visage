import React from 'react';

export interface Visage<TTheme extends Theme> {
  breakpoint: number;
  generate(styleSheet: StyleSheet<any>): { [prop: string]: any };
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
    | (string | number | null | undefined | TStyleSheet[K])[]
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
  [extra: string]: any;
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

export type VisageComponentProps<
  TStyleSheet extends ValidStyleSheet,
  TDefaultComponent extends ComponentConstraint,
  TOverrideComponent extends ComponentConstraint = React.FunctionComponent<{}>
> = {
  as?: TOverrideComponent;
} & React.ComponentProps<TDefaultComponent> &
  React.ComponentProps<TOverrideComponent> &
  StyleProps<TStyleSheet>;

export type ExtractVisageComponentProps<T> = T extends VisageComponent<
  infer P,
  infer S
>
  ? P & StyleProps<S>
  : {};

export interface VisageComponent<
  TComponentProps,
  TStyleSheet extends ValidStyleSheet
> {
  displayName?: string;
  <P>(
    props: { as: React.FunctionComponent<P> } & TComponentProps &
      P &
      StyleProps<TStyleSheet>,
  ): React.ReactElement | null;
  <P>(
    props: { as: React.ComponentClass<P> } & TComponentProps &
      P &
      StyleProps<TStyleSheet>,
  ): React.ReactElement | null;
  <P>(
    props: { as: VisageComponent<P, any> } & TComponentProps &
      P &
      StyleProps<TStyleSheet>,
  ): React.ReactElement | null;
  <C extends keyof JSX.IntrinsicElements>(
    props: { as: C } & TComponentProps &
      JSX.IntrinsicElements[C] &
      StyleProps<TStyleSheet>,
  ): React.ReactElement | null;
  (
    props: { as?: undefined } & TComponentProps & StyleProps<TStyleSheet>,
  ): React.ReactElement | null;
}

export interface ComponentFactory<TStyleSheet extends ValidStyleSheet> {
  <TDefaultComponent extends ComponentConstraint>(
    as: TDefaultComponent,
    options?: {
      displayName?: string;
      defaultStyles?: StyleSheet<TStyleSheet>;
    },
  ): VisageComponent<React.ComponentProps<TDefaultComponent>, TStyleSheet>;
}

export interface UseDesignSystemHookOptions<TTheme extends Theme = Theme> {
  is?: number;
  styleGenerator: StyleGenerator;
  theme: TTheme;
}

export interface UseDesignSystemHook<TTheme extends Theme = Theme> {
  (options?: UseDesignSystemHookOptions<TTheme>): Visage<TTheme>;
}

export interface UseVisageHookOptions<TStyleSheet extends ValidStyleSheet> {
  as: any;
  defaultStyles?: StyleSheet<TStyleSheet>;
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

export interface VariantedComponentCreator<TStyleProps extends {}> {
  <
    P,
    TPropName extends keyof any,
    TVariantStyleSheets extends {
      default: StyleSheet<TStyleProps>;
      [variantName: string]: StyleSheet<TStyleProps>;
    }
  >(
    component: React.FunctionComponent<P>,
    propName: TPropName,
    variantStyles: TVariantStyleSheets,
    defaultValue?: keyof TVariantStyleSheets | 'default',
  ): VisageComponent<
    P & { [K in TPropName]?: keyof TVariantStyleSheets },
    TStyleProps
  >;
  <
    P,
    TPropName extends keyof any,
    TVariantStyleSheets extends {
      default: StyleSheet<TStyleProps>;
      [variantName: string]: StyleSheet<TStyleProps>;
    }
  >(
    component: React.ComponentClass<P>,
    propName: TPropName,
    variantStyles: TVariantStyleSheets,
    defaultValue?: keyof TVariantStyleSheets | 'default',
  ): VisageComponent<
    P & { [K in TPropName]?: keyof TVariantStyleSheets },
    TStyleProps
  >;
  <
    P,
    TPropName extends keyof any,
    TVariantStyleSheets extends {
      default: StyleSheet<TStyleProps>;
      [variantName: string]: StyleSheet<TStyleProps>;
    }
  >(
    component: VisageComponent<P, any>,
    propName: TPropName,
    variantStyles: TVariantStyleSheets,
    defaultValue?: keyof TVariantStyleSheets | 'default',
  ): VisageComponent<
    P & { [K in TPropName]?: keyof TVariantStyleSheets },
    TStyleProps
  >;
  <
    C extends keyof JSX.IntrinsicElements,
    TPropName extends keyof any,
    TVariantStyleSheets extends {
      default: StyleSheet<TStyleProps>;
      [variantName: string]: StyleSheet<TStyleProps>;
    }
  >(
    component: C,
    propName: TPropName,
    variantStyles: TVariantStyleSheets,
    defaultValue?: keyof TVariantStyleSheets | 'default',
  ): VisageComponent<
    JSX.IntrinsicElements[C] & { [K in TPropName]?: keyof TVariantStyleSheets },
    TStyleProps
  >;
}
