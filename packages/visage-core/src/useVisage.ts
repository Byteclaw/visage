import isEqual from 'fast-deep-equal-ts/react';
import { useRef } from 'react';
import { isVisageComponent } from './utils';
import { StyleSheet } from './styleSheet';
import { StyleProps, StyleFunction } from './types';
import { useDesignSystem } from './useDesignSystem';

const DEFAULT_PARENT_STYLES: StyleSheet<VisageStylingProperties>[] = [];

export interface UseVisageHookOptions {
  componentName: string;
  defaultStyles: StyleSheet<VisageStylingProperties> | StyleFunction<any>;
  faceStyleSheet: { face: string };
  omitProps(props: { [key: string]: any }): { [key: string]: any };
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
    ...restProps
  }: StyleProps & { [key: string]: any },
  options: UseVisageHookOptions,
): TOutputProps {
  const visage = useDesignSystem();
  const propsRef = useRef<{ [key: string]: any }>();
  const styleSheetRef = useRef<StyleSheet<VisageStylingProperties>>();

  // now resolve style sheet and store it under styles
  if (typeof options.defaultStyles === 'function') {
    if (!isEqual(propsRef.current, restProps)) {
      styleSheetRef.current = options.defaultStyles(restProps);
      propsRef.current = restProps;
    }
  } else if (styleSheetRef.current !== options.defaultStyles) {
    styleSheetRef.current = options.defaultStyles;
  }

  let localStyles:
    | StyleSheet<VisageStylingProperties>[]
    | undefined = visage.styleSheetCache.get(
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

  const passProps: StyleProps & {
    [key: string]: any;
  } = options.omitProps(restProps);

  // strip styles, parentStyles from props
  // if component is visage component, pass parentStyles and styles
  // otherwise generate styles
  if (!isVisageComponent(as)) {
    let finalStyleSheets: StyleSheet<VisageStylingProperties>[] = localStyles;

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

    const styleProps = visage.generate(finalStyleSheets);

    return { ...passProps, ...styleProps } as any;
  }

  return {
    ...passProps,
    parentStyles: localStyles,
    styles, // move to child component
  } as any;
}
