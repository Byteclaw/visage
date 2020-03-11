import {
  ResolvedStyleSheet,
  StyleSheet,
  StylerSheetResolveContext,
  StylerFunction,
  StylerResultType,
  StyleSheetScalarValue,
} from './types';

export type RawStylerFunction<
  TResult extends StyleSheet<any> | ResolvedStyleSheet
> = (
  propName: string,
  value: StyleSheetScalarValue,
  ctx: StylerSheetResolveContext,
) => TResult;

export function createStyler<
  TResult extends StyleSheet<any> | ResolvedStyleSheet
>(type: StylerResultType, styler: RawStylerFunction<TResult>): StylerFunction {
  return (...args) => ({
    type,
    styles: styler(...args) as any,
  });
}

export function inPlaceStyler(styler: RawStylerFunction<StyleSheet<any>>) {
  return createStyler(StylerResultType.inPlace, styler);
}

export function inPlaceFinalStyler(
  styler: RawStylerFunction<ResolvedStyleSheet>,
) {
  return createStyler(StylerResultType.inPlaceFinal, styler);
}

export function preStyler(styler: RawStylerFunction<StyleSheet<any>>) {
  return createStyler(StylerResultType.pre, styler);
}

export function preFinalStyler(styler: RawStylerFunction<ResolvedStyleSheet>) {
  return createStyler(StylerResultType.preFinal, styler);
}

export function postStyler(styler: RawStylerFunction<StyleSheet<any>>) {
  return createStyler(StylerResultType.post, styler);
}

export function postFinalStyler(styler: RawStylerFunction<ResolvedStyleSheet>) {
  return createStyler(StylerResultType.postFinal, styler);
}
