/* eslint-disable max-classes-per-file */
import { StyleSheet } from './styleSheet';

export interface StyleSheetCache {
  get(
    faceStyleSheet: StyleSheet<VisageStylingProperties>,
    parentStyleSheets: StyleSheet<VisageStylingProperties>[],
    localStyleSheet: StyleSheet<VisageStylingProperties>,
  ): StyleSheet<VisageStylingProperties>[] | undefined;
  getByOverride(
    faceStyleSheet: StyleSheet<VisageStylingProperties>,
    parentStyleSheets: StyleSheet<VisageStylingProperties>[],
    styleOverrideStyleSheet: StyleSheet<VisageStylingProperties>,
    localStyleSheet: StyleSheet<VisageStylingProperties>,
  ): StyleSheet<VisageStylingProperties>[] | undefined;
  set(
    faceStyleSheet: StyleSheet<VisageStylingProperties>,
    parentStyleSheets: StyleSheet<VisageStylingProperties>[],
    localStyleSheet: StyleSheet<VisageStylingProperties>,
  ): StyleSheet<VisageStylingProperties>[];
  setByOverride(
    faceStyleSheet: StyleSheet<VisageStylingProperties>,
    parentStyleSheets: StyleSheet<VisageStylingProperties>[],
    styleOverrideStyleSheet: StyleSheet<VisageStylingProperties>,
    localStyleSheet: StyleSheet<VisageStylingProperties>,
  ): StyleSheet<VisageStylingProperties>[];
}

export function createCache(): StyleSheetCache {
  const cache = new WeakMap<
    StyleSheet<VisageStylingProperties>,
    WeakMap<
      StyleSheet<VisageStylingProperties>[],
      WeakMap<
        StyleSheet<VisageStylingProperties>,
        StyleSheet<VisageStylingProperties>[]
      >
    >
  >();
  const overrideCache = new WeakMap<
    StyleSheet<VisageStylingProperties>,
    WeakMap<
      StyleSheet<VisageStylingProperties>[],
      WeakMap<
        StyleSheet<VisageStylingProperties>,
        WeakMap<
          StyleSheet<VisageStylingProperties>,
          StyleSheet<VisageStylingProperties>[]
        >
      >
    >
  >();

  return {
    get(faceStyleSheet, parentStyleSheets, localStyleSheet) {
      return cache
        .get(faceStyleSheet)
        ?.get(parentStyleSheets)
        ?.get(localStyleSheet);
    },
    getByOverride(
      faceStyleSheet,
      parentStyleSheets,
      styleOverrideStyleSheet,
      localStyleSheet,
    ) {
      return overrideCache
        .get(faceStyleSheet)
        ?.get(parentStyleSheets)
        ?.get(styleOverrideStyleSheet)
        ?.get(localStyleSheet);
    },
    set(faceStyleSheet, parentStyleSheets, localStyleSheet) {
      const byFace = cache.get(faceStyleSheet);

      if (!byFace) {
        const styles = [localStyleSheet, faceStyleSheet, ...parentStyleSheets];

        cache.set(
          faceStyleSheet,
          new WeakMap([
            [parentStyleSheets, new WeakMap([[localStyleSheet, styles]])],
          ]),
        );

        return styles;
      }

      const byParentStyles = byFace.get(parentStyleSheets);

      if (!byParentStyles) {
        const styles = [localStyleSheet, faceStyleSheet, ...parentStyleSheets];

        byFace.set(parentStyleSheets, new WeakMap([[localStyleSheet, styles]]));

        return styles;
      }

      const byLocalStyles = byParentStyles.get(localStyleSheet);

      if (!byLocalStyles) {
        const styles = [localStyleSheet, faceStyleSheet, ...parentStyleSheets];

        byParentStyles.set(localStyleSheet, styles);

        return styles;
      }

      return byLocalStyles;
    },
    setByOverride(
      faceStyleSheet,
      parentStyleSheets,
      styleOverrideStyleSheet,
      localStyleSheet,
    ) {
      const byFace = overrideCache.get(faceStyleSheet);

      if (!byFace) {
        const styles = [
          localStyleSheet,
          faceStyleSheet,
          ...parentStyleSheets,
          styleOverrideStyleSheet,
        ];

        overrideCache.set(
          faceStyleSheet,
          new WeakMap([
            [
              parentStyleSheets,
              new WeakMap([
                [
                  styleOverrideStyleSheet,
                  new WeakMap([[localStyleSheet, styles]]),
                ],
              ]),
            ],
          ]),
        );

        return styles;
      }

      const byParentStyles = byFace.get(parentStyleSheets);

      if (!byParentStyles) {
        const styles = [
          localStyleSheet,
          faceStyleSheet,
          ...parentStyleSheets,
          styleOverrideStyleSheet,
        ];

        byFace.set(
          parentStyleSheets,
          new WeakMap([
            [styleOverrideStyleSheet, new WeakMap([[localStyleSheet, styles]])],
          ]),
        );

        return styles;
      }

      const byStyleOverride = byParentStyles.get(styleOverrideStyleSheet);

      if (!byStyleOverride) {
        const styles = [
          localStyleSheet,
          faceStyleSheet,
          ...parentStyleSheets,
          styleOverrideStyleSheet,
        ];

        byParentStyles.set(
          styleOverrideStyleSheet,
          new WeakMap([[localStyleSheet, styles]]),
        );

        return styles;
      }

      const byLocalStyles = byStyleOverride.get(localStyleSheet);

      if (!byLocalStyles) {
        const styles = [
          localStyleSheet,
          faceStyleSheet,
          ...parentStyleSheets,
          styleOverrideStyleSheet,
        ];

        byStyleOverride.set(localStyleSheet, styles);

        return styles;
      }

      return byLocalStyles;
    },
  };
}
