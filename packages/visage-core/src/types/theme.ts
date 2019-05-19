export interface ThemeCreator {
  (breakpoint: number): Theme;
}

export interface Theme {
  breakpoint(): number;
  resolve(style: string, value: any, defaultValue?: any): any;
}
