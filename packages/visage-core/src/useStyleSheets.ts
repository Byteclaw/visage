import isEqual from 'fast-deep-equal-ts/react';
import { useRef } from 'react';
import { StyleSheet } from './styleSheet';
import { StyleFunction } from './types';

interface Refs {
  computedLocalStyles: StyleSheet<any>;
  faceName: string;
  faceStyles: StyleSheet<any>;
  localStyles: StyleSheet<any> | StyleFunction<any> | undefined;
  parentStyles: StyleSheet<any>[] | undefined;
  props: { [key: string]: any };
  styles: StyleSheet<any> | undefined;
}

const defaultStyleSheets: StyleSheet<any>[] = [];

export function useStyleSheets(
  faceName: string,
  localStyles: StyleSheet<any> | StyleFunction<any> | undefined,
  parentStyles: StyleSheet<any>[] | undefined,
  styles: StyleSheet<any> | undefined,
  props: { [key: string]: any },
): StyleSheet<any>[] {
  const refs = useRef<Refs>({
    computedLocalStyles: {},
    faceName: '',
    faceStyles: {},
    localStyles: undefined,
    parentStyles: [],
    props: {},
    styles: undefined,
  });
  const styleSheetsRef = useRef<StyleSheet<any>[]>(defaultStyleSheets);
  let changed = false;

  if (refs.current.faceName !== faceName) {
    refs.current.faceName = faceName;
    refs.current.faceStyles = { face: faceName };
    changed = true;
  }

  // if local styles are function then we need to compare props too, not only local styles
  if (typeof localStyles === 'function') {
    if (
      refs.current.localStyles !== localStyles ||
      !isEqual(refs.current.props, props)
    ) {
      changed = true;

      refs.current.localStyles = localStyles;
      refs.current.computedLocalStyles = localStyles(props) as any;
      refs.current.props = props;
    }
  } else if (refs.current.localStyles !== localStyles) {
    changed = true;

    // we dont need to compare styles using deep equality because
    // local styles are defined by createComponent
    refs.current.localStyles = localStyles;
    refs.current.computedLocalStyles = localStyles || {};
  }

  if (refs.current.parentStyles !== parentStyles) {
    changed = true;
    refs.current.parentStyles = parentStyles;
  }

  if (!isEqual(refs.current.styles, styles)) {
    changed = true;
    refs.current.styles = styles || {};
  }

  if (changed) {
    styleSheetsRef.current = [
      refs.current.computedLocalStyles,
      refs.current.faceStyles,
      ...(refs.current.parentStyles || []),
      refs.current.styles || {},
    ];
  }

  return styleSheetsRef.current;
}
