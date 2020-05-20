import isEqual from 'fast-deep-equal-ts/react';
import { useRef } from 'react';
import { OmitPropsSetting, omitProps } from '@byteclaw/visage-utils';
import { isVisageComponent } from './utils';
import { StyleSheet } from './styleSheet';
import { StyleProps, StyleFunction } from './types';
import { useDesignSystem } from './useDesignSystem';
import { useVariantSettings } from './useVariantSettings';

const DEFAULT_PARENT_STYLES: StyleSheet[] = [];
const DEFAULT_VARIANT_PROCESSORS: OmitPropsSetting[] = [];

export interface UseVisageHookOptions {
  componentName: string;
  defaultStyles: StyleSheet | StyleFunction<any>;
  faceStyleSheet: { face: string };
  variants: OmitPropsSetting[];
}

/**
 * This hook contains the logic for visage component
 *
 * Using this hook you can implement your own custom component that uses visage
 */
export function useVisage<TOutputProps extends { [prop: string]: any }>(
  as: any,
  {
    parentStyles = DEFAULT_PARENT_STYLES,
    styles,
    $$variants = DEFAULT_VARIANT_PROCESSORS,
    ...restProps
  }: StyleProps & { [key: string]: any },
  options: UseVisageHookOptions,
): TOutputProps {
  const visage = useDesignSystem();
  const propsRef = useRef<{ [key: string]: any }>();
  const variantSettings = useVariantSettings(options.variants, $$variants);
  const styleSheetRef = useRef<StyleSheet>();

  // now resolve style sheet and store it under styles
  if (typeof options.defaultStyles === 'function') {
    if (!isEqual(propsRef.current, restProps)) {
      styleSheetRef.current = options.defaultStyles(restProps);
      propsRef.current = restProps;
    }
  } else if (styleSheetRef.current !== options.defaultStyles) {
    styleSheetRef.current = options.defaultStyles;
  }

  let localStyles: StyleSheet[] | undefined = visage.styleSheetCache.get(
    options.faceStyleSheet,
    parentStyles,
    styleSheetRef.current!,
  );

  if (!localStyles) {
    localStyles = visage.styleSheetCache.set(
      options.faceStyleSheet,
      parentStyles,
      styleSheetRef.current!,
    );
  }

  // strip styles, parentStyles from props
  // if component is visage component, pass parentStyles and styles
  // otherwise generate styles
  if (!isVisageComponent(as)) {
    let finalStyleSheets: StyleSheet[] = localStyles;

    if (styles) {
      const cachedStyles = visage.styleSheetCache.getByOverride(
        options.faceStyleSheet,
        parentStyles,
        styles,
        styleSheetRef.current!,
      );

      if (!cachedStyles) {
        finalStyleSheets = visage.styleSheetCache.setByOverride(
          options.faceStyleSheet,
          parentStyles,
          styles,
          styleSheetRef.current!,
        );
      } else {
        finalStyleSheets = cachedStyles;
      }
    }

    // some style generators do not output class names so be careful, this is just general purpose
    const styleProps = visage.generate(finalStyleSheets);
    // process props using variant processors
    // this will strip props according to processor settings
    const passProps = omitProps(restProps, variantSettings);
    const className =
      styleProps.className || passProps.className
        ? `${styleProps.className || ''} ${passProps.className || ''}`.trim()
        : undefined;

    return { ...passProps, ...styleProps, className } as any;
  }

  return {
    ...restProps,
    parentStyles: localStyles,
    styles, // move to child component
    $$variants: variantSettings, // send all variants to extended component
  } as any;
}
