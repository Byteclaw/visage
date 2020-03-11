import { ThemeStylerSettingsObject } from './types';
import {
  ResolvedStyleSheet,
  StylerFunction,
  StylerResultType,
  RawStylerFunction,
  createStyler,
} from '../styleSheet';

export function createStylerFromSettings(
  name: string,
  settings: ThemeStylerSettingsObject<any, any>,
): StylerFunction {
  const type: StylerResultType = settings.type || StylerResultType.inPlaceFinal;
  let outputProps: string[] = [name];

  if (typeof settings.outputProps === 'string') {
    outputProps = [settings.outputProps];
  } else if (
    Array.isArray(settings.outputProps) &&
    settings.outputProps.length > 0
  ) {
    outputProps = settings.outputProps;
  }

  const outputPropsLength = outputProps.length;

  const styler: RawStylerFunction<any> = (propName, value, ctx) => {
    let resolvedValue = value;
    const resolver =
      (settings.resolver && ctx.resolvers[settings.resolver]) ??
      ctx.resolvers.themeKey;

    resolvedValue = resolver(propName, value, ctx);

    // now if the value is an object we can't use formatter
    if (typeof resolvedValue === 'object' && resolvedValue !== null) {
      return resolvedValue;
    }

    if (settings.format && ctx.formatters[settings.format]) {
      resolvedValue = ctx.formatters[settings.format](
        propName,
        resolvedValue,
        ctx,
      );
    }

    const styles: ResolvedStyleSheet = {};

    for (let i = 0; i < outputPropsLength; i++) {
      styles[outputProps[i]] = resolvedValue;
    }

    return styles;
  };

  return createStyler(type, styler);
}
