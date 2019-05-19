import { CSSProperties } from 'react';
import { Theme, StyleSheetHook } from '../types';

export function createStylePropStyleSheetHook(
  theme: Theme,
): StyleSheetHook<{ styles?: CSSProperties }, { style: CSSProperties }> {
  return (componentProps, defaultProps, extraStylers = {}) => {
    const flatten = (): { styles: CSSProperties } => ({
      styles: {
        ...(defaultProps ? defaultProps.styles : {}),
        ...componentProps.styles,
        ...(componentProps.parentStyleSheet
          ? componentProps.parentStyleSheet.flatten()
          : {}),
      },
    });

    return {
      flatten,
      generateStyles() {
        const { styles, parentStyleSheet, ...restProps } = componentProps;
        const flattenedStyles = flatten().styles;

        const style = (Object.keys(
          flattenedStyles,
        ) as (keyof CSSProperties)[]).reduce(
          (finalStyleDef, prop) => {
            const propValue = flattenedStyles[prop];

            // if extra styler is used, do not resolve directly against theme
            const props = extraStylers[prop]
              ? extraStylers[prop](theme, propValue)
              : theme.resolve(prop, propValue);

            if (typeof props === 'object') {
              return {
                ...finalStyleDef,
                ...props,
              };
            }

            return {
              ...finalStyleDef,
              [prop]: props,
            };
          },
          {} as CSSProperties,
        );

        return { style, ...restProps };
      },
    };
  };
}
