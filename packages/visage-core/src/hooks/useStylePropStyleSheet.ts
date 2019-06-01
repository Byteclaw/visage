import { CSSProperties } from 'react';
import { Theme, StyleSheetHook } from '../types';

interface StyleProps {
  styles?: CSSProperties;
}

export function createStylePropStyleSheetHook(
  theme: Theme,
): StyleSheetHook<StyleProps, { style: CSSProperties }> {
  return (componentProps, defaultProps, extraStylers = {}) => {
    const mergedExtraStylers = {
      ...theme.stylers(),
      ...extraStylers,
    };
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
            const props = mergedExtraStylers[prop]
              ? mergedExtraStylers[prop](
                  theme,
                  propValue,
                  componentProps,
                  flattenedStyles,
                )
              : theme.resolve(
                  prop,
                  propValue,
                  undefined,
                  componentProps,
                  flattenedStyles,
                );

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
