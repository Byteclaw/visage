import { Theme } from '@byteclaw/visage-core';
import { createComponent } from '../core';

export const Svg = createComponent('div', {
  defaultProps: {
    styles: {
      display: 'inline',
      verticalAlign: 'top',
    },
  },
  extraStylers: {
    color: (
      theme: Theme,
      color: any,
      componentProps: any,
      styleProps: any,
    ): any => {
      // @ts-ignore
      return {
        fill: theme.resolve(
          'color',
          color,
          undefined,
          componentProps,
          styleProps,
        ),
        'path:last-child': {
          fill: theme.resolve(
            'color',
            color,
            undefined,
            componentProps,
            styleProps,
          ),
        },
      };
    },
    // override font size to so we can use larger size
    height: (theme: Theme, height: any, componentProps: any, styleProps: any) =>
      theme.resolve(
        'lineHeight',
        height,
        undefined,
        componentProps,
        styleProps,
      ),
    width: (theme: Theme, width: any, componentProps: any, styleProps: any) =>
      theme.resolve('lineHeight', width, undefined, componentProps, styleProps),
  },
});
