import { omitProps } from '@byteclaw/visage-utils';
import { isVisageComponent } from './utils';
import { StyleSheet } from './styleSheet';
import { StyleProps, StyleFunction } from './types';
import { useStyleSheets } from './useStyleSheets';
import { useDesignSystem } from './useDesignSystem';
import { useMemoizedCallback } from './useMemoizedCallback';

export interface UseVisageHookOptions {
  as: any;
  componentName: string;
  defaultStyles?: StyleSheet<VisageStylingProperties> | StyleFunction<any>;
  variants?: {
    prop: string;
    name: string;
    stripProp: boolean;
    defaultValue: string | boolean;
  }[];
}

/**
 * This hook contains the logic for visage component
 *
 * Using this hook you can implement your own custom component that uses visage
 */
export function useVisage<TOutputProps extends { [prop: string]: any }>(
  { parentStyles, styles, ...restProps }: StyleProps & { [key: string]: any },
  options: UseVisageHookOptions,
): TOutputProps {
  const visage = useDesignSystem();
  const generateStyles = useMemoizedCallback(visage.generate);
  const styleSheets = useStyleSheets(
    options.componentName,
    options.defaultStyles,
    parentStyles as any,
    styles as any,
    restProps,
  );

  const passProps: StyleProps & {
    [key: string]: any;
  } =
    options.variants && options.variants.length > 0
      ? omitProps(restProps, options.variants)
      : restProps;

  // strip styles, parentStyles from props
  // if component is visage component, pass parentStyles and styles
  // otherwise generate styles
  if (!isVisageComponent(options.as)) {
    const styleProps = generateStyles(...styleSheets);

    return { ...passProps, ...styleProps } as any;
  }

  return {
    ...passProps,
    parentStyles: styleSheets,
  } as any;
}
