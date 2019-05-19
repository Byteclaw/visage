import { StyleSheetCreatorHook, Theme } from '@byteclaw/visage-core';
import { css } from 'emotion';
import { CSSProperties } from 'react';

export type GeneratedStyles = {
  [pseudo: string]: CSSProperties;
} & CSSProperties;

export function extend(
  defaultStyles?: CSSProps,
  localStyles?: CSSProps,
  parentStyles?: CSSProps,
): CSSProps | undefined {
  if (!(defaultStyles || localStyles || parentStyles)) {
    return {};
  }

  return {
    ...defaultStyles,
    ...localStyles,
    ...parentStyles,
  };
}

interface ExtensionStylesMap {
  /**
   * Style prop name to pseudoclass name
   */
  [styleProp: string]: string;
}

interface ExtraStylersMap {
  [stylerPropName: string]: (theme: Theme, propValue: any) => CSSProperties;
}

function resolveCssProps(
  theme: Theme,
  cssProps: CSSProps | undefined,
  extraStylers: ExtraStylersMap = {},
): CSSProperties {
  if (cssProps == null) {
    return {};
  }

  return (Object.keys(cssProps) as (keyof CSSProps)[]).reduce(
    (cssProperties, cssProp) => {
      const propValue = cssProps[cssProp];

      // cssProp is a part of extra stylers, do not resolve it agains theme directly
      const props = extraStylers[cssProp]
        ? extraStylers[cssProp](theme, propValue)
        : theme.resolve(cssProp, propValue);

      if (typeof props === 'object') {
        return {
          ...cssProperties,
          ...props,
        };
      }

      // eslint-disable-next-line no-param-reassign
      cssProperties[cssProp] = props;

      return cssProperties;
    },
    {} as CSSProperties,
  );
}

/**
 * Finishes style sheet so we can generate final class name or other representation of style
 *
 * Basically this will create a CSS object for emotion with all the pseudoclasses
 * Applies current design system state so we get the final css prop values from responsive values
 */
export function finish(
  stylingProps: { [key: string]: any; styles?: CSSProps },
  extensionStylesMap: ExtensionStylesMap,
  theme: Theme,
  extraStylers: ExtraStylersMap = {},
): GeneratedStyles {
  const cssObj: GeneratedStyles = resolveCssProps(
    theme,
    stylingProps.styles,
    extraStylers,
  ) as GeneratedStyles;
  const extensionStyles = Object.keys(extensionStylesMap);

  if (extensionStyles.length === 0) {
    return cssObj;
  }

  for (let i = 0; i < extensionStyles.length; i++) {
    const stylePropName = extensionStyles[i];
    const cssProps = stylingProps[stylePropName];

    if (Object.keys(cssProps).length > 0)
      cssObj[`&:${extensionStylesMap[stylePropName]}`] = resolveCssProps(
        theme,
        cssProps,
        extraStylers,
      );
  }

  return cssObj;
}

/**
 * This is the map of style prop name to css pseudoclass
 */
export const extensionStyleMap = {
  activeStyles: 'active',
  focusStyles: 'focus',
  hoverStyles: 'hover',
};

export const extensionStylePropNames: (keyof (typeof extensionStyleMap))[] = Object.keys(
  extensionStyleMap,
) as (keyof (typeof extensionStyleMap))[];

/**
 * These are the default styling props supported by all the components in design system
 * This can be extended per component, see createComponent
 */
export interface StylingProps {
  activeStyles?: CSSProps;
  focusStyles?: CSSProps;
  hoverStyles?: CSSProps;
  styles?: CSSProps;
}

export type CSSProp<Value> =
  | Value
  | null
  | undefined
  | ((Value | null | undefined)[]);

export type CSSProps = {
  [K in keyof CSSProperties]: CSSProp<CSSProperties[K]>
};

export const createEmotionStyleSheetHook: StyleSheetCreatorHook<
  StylingProps,
  { className?: string }
> = theme => {
  return (componentProps, defaultProps, extraStylers = {}) => {
    function flatten() {
      const extensionStyles: StylingProps = {};
      const parentFlattenedStyleSheet = componentProps.parentStyleSheet
        ? componentProps.parentStyleSheet.flatten()
        : {};

      extensionStylePropNames.forEach(extensionStyleProp => {
        extensionStyles[extensionStyleProp] = extend(
          defaultProps ? defaultProps[extensionStyleProp] : undefined,
          componentProps[extensionStyleProp],
          parentFlattenedStyleSheet[extensionStyleProp],
        );
      });

      return {
        ...extensionStyles,
        styles: extend(
          defaultProps ? defaultProps.styles : undefined,
          componentProps.styles,
          parentFlattenedStyleSheet.styles,
        ),
      };
    }

    return {
      flatten,
      generateStyles() {
        const {
          className: passedClassNames,
          parentStyleSheet,
          styles,
          ...restProps
        } = componentProps;

        const cssObj = finish(
          flatten(),
          extensionStyleMap,
          theme,
          extraStylers,
        );
        const className =
          Object.keys(cssObj).length > 0 ? css(cssObj as any) : undefined;

        // delete extra props styling props
        // delete keys
        extensionStylePropNames.forEach(styleProp => {
          delete restProps[styleProp];
        });

        return {
          ...restProps,
          className: passedClassNames
            ? `${passedClassNames} ${className}`
            : className,
        };
      },
    };
  };
};
