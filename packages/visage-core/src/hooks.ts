import React from 'react';
import { VisageContext } from './context';
import {
  extendStyleSheet,
  isVisageComponent,
  resolveStyleSheet,
} from './utils';
import {
  StyleProps,
  StyleSheet,
  Theme,
  UseDesignSystemHookOptions,
  UseVisageHookOptions,
  Visage,
  ValidStyleSheet,
} from './types';

export function useDesignSystem<TTheme extends Theme = Theme>(
  options?: UseDesignSystemHookOptions<TTheme>,
): Visage<TTheme> {
  // if options are provided, we want to create new Visage instance
  // otherwise we want to connect to parent
  const ctx: Visage<TTheme> | undefined = React.useContext(VisageContext);

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

      return {
        breakpoint,
        generate(styleSheet) {
          const resolvedStyleSheet = resolveStyleSheet(
            styleSheet,
            breakpoint,
            options.theme,
          );

          return options.styleGenerator(resolvedStyleSheet);
        },
        theme: options.theme,
      };
    }, [options.is, options.theme, options.styleGenerator]);
  }

  // ctx is defined because there is a check above
  return ctx as Visage<TTheme>;
}

export function useVisage<
  TStyleSheet extends ValidStyleSheet,
  TOutputProps extends { [prop: string]: any }
>(
  { styles, parentStyles, ...restProps }: StyleProps<TStyleSheet>,
  options: UseVisageHookOptions<TStyleSheet>,
): TOutputProps {
  const styleSheet = extendStyleSheet<StyleSheet<TStyleSheet>>(
    options.defaultStyles,
    extendStyleSheet<StyleSheet<TStyleSheet>>(styles, parentStyles),
  );
  const visage = useDesignSystem();

  // strip styles, parentStyles from props
  // if component is visage component, pass parentStyles and styles
  // otherwise generate styles
  if (!isVisageComponent(options.as)) {
    const styleProps = visage.generate(styleSheet);

    return { ...restProps, ...styleProps } as any;
  }

  return {
    ...restProps,
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
