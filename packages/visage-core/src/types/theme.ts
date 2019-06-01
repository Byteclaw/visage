export interface StylerFn<TStylingProps, TStyleProps = { [key: string]: any }> {
  (
    theme: Theme,
    propValue: any,
    componentProps: { [key: string]: any } & TStylingProps,
    styleProps: { [key: string]: any } & TStyleProps,
  ): any;
}

export interface ThemeCreator {
  (breakpoint: number): Theme;
}

export interface Theme {
  breakpoint(): number;
  resolve(
    style: string,
    value: any,
    defaultValue: any,
    /**
     * All component props
     */
    componentProps: { [key: string]: any },
    /**
     * Current style props
     */
    styleProps: { [key: string]: any },
  ): any;
  stylers(): { [prop: string]: StylerFn<any, any> };
}
