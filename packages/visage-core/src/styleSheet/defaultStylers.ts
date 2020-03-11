import { inPlaceFinalStyler, postStyler, preStyler } from './createStyler';
import { themeKeyResolver } from './themeKeyResolver';

export const catchAllStyler = inPlaceFinalStyler((propName, value, ctx) => {
  const resolver = ctx.resolvers[propName] ?? themeKeyResolver;
  const resolvedValue = resolver(propName, value, ctx);

  if (typeof resolvedValue === 'object' && resolvedValue !== null) {
    return resolvedValue;
  }

  return {
    [propName]: ctx.formatters[propName]
      ? ctx.formatters[propName](propName, resolvedValue, ctx)
      : resolvedValue,
  };
});

export const faceStyler = postStyler((_, value, ctx) => {
  if (ctx.theme.faces == null) {
    return {};
  }

  return typeof value !== 'string' ? {} : ctx.theme.faces[value] || {};
});

export const extendsStyler = preStyler((_, value, ctx) => {
  if (ctx.theme.mixins == null) {
    return {};
  }

  return typeof value !== 'string' ? {} : ctx.theme.mixins[value] || {};
});
