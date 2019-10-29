import {
  ComponentFactory,
  createComponent as baseCreateComponent,
} from '@byteclaw/visage-core';
import { StyleProps } from './createNPointTheme';

export const createComponent: ComponentFactory<
  StyleProps
> = baseCreateComponent;
