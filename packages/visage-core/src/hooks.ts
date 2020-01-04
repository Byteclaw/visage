import { depthFirstObjectMerge, omitProps } from '@byteclaw/visage-utils';
import compare from 'fast-deep-equal';
import React, { useMemo, useRef } from 'react';
import { VisageContext } from './context';
import { isVisageComponent } from './utils';
import { Theme } from './theme';
import {
  StyleProps,
  StyleSheet,
  UseDesignSystemHookOptions,
  UseVisageHookOptions,
  Visage,
  ValidStyleSheet,
  StyleFunction,
} from './types';

const defaultFace: StyleSheet<any> = {};

export function useDesignSystem<TTheme extends Theme = Theme>(
  options?: UseDesignSystemHookOptions<TTheme>,
): Visage<TTheme> {
  // if options are provided, we want to create new Visage instance
  // otherwise we want to connect to parent
  const ctx: Visage<TTheme> | undefined = React.useContext(VisageContext);
  const cacheRef = useRef<{ [key: string]: any }>({});
  const facesRef = useRef(options ? options.faces : null);
  const themeRef = useRef(options ? options.theme : null);

  if (!ctx) {
    if (!options) {
      throw new Error(
        `Options must be provided to useDesignSystem if used for first time`,
      );
    }
  }

  // if we pass options, we want to create new design system root
  if (options) {
    return React.useMemo<Visage<TTheme>>(() => {
      const breakpoint = options.is || 0;

      // if theme has changed, clear cache
      if (themeRef.current !== options.theme) {
        themeRef.current = options.theme;
        cacheRef.current = {};
      }

      if (
        facesRef.current == null ||
        (facesRef.current !== options.faces &&
          compare(facesRef.current, options.faces) === false)
      ) {
        facesRef.current = options.faces;
        cacheRef.current = {};
      }

      return {
        breakpoint,
        face(componentName) {
          if (options.faces && options.faces[componentName]) {
            return options.faces[componentName]!;
          }

          return defaultFace;
        },
        generate(styleSheet) {
          const key = JSON.stringify(styleSheet) + breakpoint;

          if (cacheRef.current[key]) {
            return cacheRef.current[key];
          }

          const res = options.styleGenerator(
            styleSheet,
            breakpoint,
            options.theme,
          );
          cacheRef.current[key] = res;

          return res;
        },
        resolveStyle(prop, value) {
          return options.theme.resolve(prop, value, breakpoint).value;
        },
        theme: options.theme,
      };
    }, [options.is, options.faces, options.theme, options.styleGenerator]);
  }

  // ctx is defined because there is a check above
  return ctx as Visage<TTheme>;
}

type ExtractArgs<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : never;
type ExtractReturn<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;

/**
 * Uses memoizes call and returns the result
 * Refreshes if args or callback has changed
 */
export function useMemoizedCall<T extends (...args: any[]) => any>(
  cb: T,
  ...args: ExtractArgs<T>
): ExtractReturn<T> {
  const cbRef = useRef<T>(cb);
  const previousArgsRef = useRef<ExtractArgs<T> | undefined>(undefined);
  const resultRef = useRef<ExtractReturn<T> | undefined>(undefined);

  if (
    cbRef.current !== cb ||
    previousArgsRef.current == null ||
    !compare(previousArgsRef.current, args)
  ) {
    cbRef.current = cb;
    previousArgsRef.current = args;
    // first call
    resultRef.current = cb(...args);
  }

  // @ts-ignore
  return resultRef.current;
}

/**
 * Creates memoized callback that returns the last known result if args did not change
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  cb: T,
): T {
  const previousCbRef = useRef<T | null>(null);
  const memoizedResult = useRef<any>();
  const memoizedArgs = useRef<any[] | null>();
  const cbRef = useRef<T | null>(null);

  if (previousCbRef.current !== cb) {
    previousCbRef.current = cb;
    memoizedArgs.current = null;

    cbRef.current = ((...args: any[]): any => {
      if (
        memoizedArgs.current == null ||
        !compare(memoizedArgs.current, args)
      ) {
        memoizedArgs.current = args;
        memoizedResult.current = cb(...args);
      }

      return memoizedResult.current;
    }) as T;
  }

  return cbRef.current!;
}

const emptyStyleSheet: StyleSheet<any> = {};

function defaultStyleFunction(
  defaultStyles: StyleSheet<any> | StyleFunction<any, any> | undefined,
  props: object,
  styleOverrides?: StyleSheet<any>,
  parentStyles?: StyleSheet<any>,
): StyleSheet<any> {
  if (defaultStyles == null) {
    return emptyStyleSheet;
  }

  if (typeof defaultStyles === 'function') {
    return defaultStyles(props, styleOverrides, parentStyles);
  }

  return defaultStyles;
}

export function useVisage<
  TStyleSheet extends ValidStyleSheet,
  TOutputProps extends { [prop: string]: any }
>(
  {
    // extract children because it causes problems with memoization (circular references)
    children,
    styles,
    parentStyles,
    ...restProps
  }: StyleProps<TStyleSheet> & { [key: string]: any },
  options: UseVisageHookOptions<TStyleSheet>,
): TOutputProps {
  const visage = useDesignSystem();
  const generateStyles = useMemoizedCallback(visage.generate);
  const localStyles = useMemoizedCall(
    defaultStyleFunction,
    options.defaultStyles,
    restProps,
    styles,
    parentStyles,
  );
  const styleSheet = useMemoizedCall<
    (...args: StyleSheet<TStyleSheet>[]) => StyleSheet<TStyleSheet>
  >(
    depthFirstObjectMerge,
    localStyles,
    parentStyles || emptyStyleSheet,
    visage.face(options.componentName),
    styles || emptyStyleSheet,
  );

  const passProps = options.variants
    ? omitProps(restProps, options.variants)
    : restProps;

  // strip styles, parentStyles from props
  // if component is visage component, pass parentStyles and styles
  // otherwise generate styles
  if (!isVisageComponent(options.as)) {
    const styleProps = generateStyles(styleSheet);

    return { children, ...passProps, ...styleProps } as any;
  }

  return {
    ...passProps,
    children,
    parentStyles: styleSheet,
  } as any;
}

interface StateBreakpointAction {
  type: 'SET_BREAKPOINT';
  index: number;
  matches: boolean;
}

interface BreakPointManagerState {
  matches: boolean[];
  viewport: number;
}

function init({
  defaultBreakpoint,
  breakpoints,
}: {
  defaultBreakpoint: number;
  breakpoints: string[];
}): BreakPointManagerState {
  const matches = breakpoints.map(() => false);
  matches[defaultBreakpoint] = true;

  return {
    matches,
    viewport: matches.lastIndexOf(true),
  };
}

function reducer(
  previousState: BreakPointManagerState,
  action: StateBreakpointAction,
) {
  if (action.type === 'SET_BREAKPOINT') {
    const matches = previousState.matches.slice();
    matches[action.index] = action.matches;

    return {
      matches,
      viewport: matches.lastIndexOf(true),
    };
  }

  throw new Error('Unknown action');
}

export function useBreakpointManager(
  defaultBreakpoint: number,
  breakpoints: string[],
): [number, (breakpoint: number, matches?: boolean) => void] {
  const [state, dispatch] = React.useReducer(
    reducer,
    { defaultBreakpoint, breakpoints },
    init,
  );
  const setBreakpoint = React.useCallback(
    (index: number, matches: boolean = true) => {
      dispatch({ type: 'SET_BREAKPOINT', index, matches });
    },
    [dispatch],
  );

  return [state.viewport, setBreakpoint];
}

export function useBreakpoint({
  gte,
  is,
  lte,
  not,
}: {
  gte?: number;
  is?: number | number[];
  lte?: number;
  not?: number | number[];
}): boolean {
  const visage = useDesignSystem();

  return useMemo(() => {
    // now check the breakpoints, basically start with more precise breakpoints
    let isMatch = false;

    if (is != null) {
      isMatch =
        is === visage.breakpoint ||
        (Array.isArray(is) && is.indexOf(visage.breakpoint) !== -1);
    } else if (not != null) {
      isMatch = Array.isArray(not)
        ? not.indexOf(visage.breakpoint) === -1
        : not !== visage.breakpoint;
    } else if (gte != null) {
      isMatch = visage.breakpoint >= gte;
    } else if (lte != null) {
      isMatch = visage.breakpoint <= lte;
    }

    return isMatch;
  }, [visage, gte, is, lte, not]);
}
