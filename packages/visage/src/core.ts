import {
  ComponentFactory,
  VariantedComponentCreator,
  createVariant as baseCreateVariant,
  createComponent as baseCreateComponent,
} from '@byteclaw/visage-core';
import { StyleProps } from './createNPointTheme';

export const createComponent: ComponentFactory<
  StyleProps
> = baseCreateComponent;

export const createVariant: VariantedComponentCreator<
  StyleProps
> = baseCreateVariant;
