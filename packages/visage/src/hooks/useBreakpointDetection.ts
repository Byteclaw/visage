import { useEffect } from 'react';

/**
 * Sets up breakpoint detection using window.matchMedia API
 */
export function useBreakpointDetection(
  enabled: boolean,
  breakpoints: string[],
  setBreakpoint: (index: number, matches: boolean) => void,
) {
  return useEffect(() => {
    if (!enabled) {
      return;
    }

    const mediaQueryList: {
      list: MediaQueryList;
      listener: (e: MediaQueryListEvent) => void;
    }[] = [];

    if (typeof window !== 'undefined' && window.matchMedia) {
      const matches = breakpoints.map((mediaQuery, mqIndex) => {
        const mqList = window.matchMedia(mediaQuery);
        const listener = (e: MediaQueryListEvent) => {
          setBreakpoint(mqIndex, e.matches);
        };

        // register media query listener
        mqList.addListener(listener);

        // push listener to mediaQueryList
        mediaQueryList.push({ list: mqList, listener });

        return mqList.matches;
      });

      // set initial matches
      matches.forEach((match, index) => setBreakpoint(index, match));

      return () => {
        mediaQueryList.forEach(({ list, listener }) =>
          list.removeListener(listener as EventListener),
        );
      };
    }
  }, [enabled, breakpoints, setBreakpoint]);
}
