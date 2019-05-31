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
    color: (theme: Theme, color: any): any => {
      // @ts-ignore
      return {
        fill: theme.resolve('color', color),
        'path:last-child': {
          fill: theme.resolve('color', color),
        },
      };
    },
    // override font size to so we can use larger size
    // fontSize: (theme: Theme, fontSize: any) => fontSize,
    height: (theme: Theme, height: any) => theme.resolve('lineHeight', height),
    width: (theme: Theme, width: any) => theme.resolve('lineHeight', width),
  },
});
