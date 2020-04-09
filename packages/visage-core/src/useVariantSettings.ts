import { OmitPropsSetting } from '@byteclaw/visage-utils';
import { useStaticMemo } from './useStaticMemo';

function deduplicateVariantSettings(
  variantSettings: OmitPropsSetting[],
  parentVariantSettings: OmitPropsSetting[],
) {
  // removes duplicit variants
  // basically the variants from parent always win, because a developer
  // said that it needs to behave like this, for example if on Button is a variant that is stripped
  // but I specify on extending component that I don't want to strip it
  // then this information needs to win

  // keeps the information about registered prop to name combinations
  const registry: { [propAndNameComb: string]: boolean } = {};

  return [...variantSettings, ...parentVariantSettings].reduceRight(
    (res, settings) => {
      if (registry[`${settings.prop}-${settings.name}`]) {
        return res;
      }

      registry[`${settings.prop}-${settings.name}`] = true;

      return [settings, ...res];
    },
    [] as OmitPropsSetting[],
  );
}

export function useVariantSettings(
  variantSettings: OmitPropsSetting[],
  parentVariantSettings: OmitPropsSetting[],
): OmitPropsSetting[] {
  return useStaticMemo(deduplicateVariantSettings, [
    variantSettings,
    parentVariantSettings,
  ]);
}
