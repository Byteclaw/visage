import {
  ComponentFactory,
  createComponent as baseCreateComponent,
} from '@byteclaw/visage-core';
import { StylingProps } from './createEmotionStyleSheetHook';

export const createComponent: ComponentFactory<
  StylingProps
> = baseCreateComponent;
