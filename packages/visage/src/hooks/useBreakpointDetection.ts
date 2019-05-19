import { useEffect } from 'react';

export function useBreakpointDetection(
  breakpoints: string[],
  setBreakpoint: (index: number, matches: boolean) => void,
): any {
  return useEffect(() => {
    const mediaQueryList: {
      list: MediaQueryList;
      listener: (e: MediaQueryListEvent) => void;
    }[] = [];
    if (window != null && window.matchMedia) {
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
    }

    return () => {
      mediaQueryList.forEach(({ list, listener }) =>
        list.removeListener(listener as EventListener),
      );
    };
  }, [breakpoints, setBreakpoint]);
}
