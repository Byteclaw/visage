import {
  ComponentFactory,
  createComponent as baseCreateComponent,
} from '@byteclaw/visage-core';
import { StyleProps } from './types';

export const createComponent: ComponentFactory<StyleProps> = baseCreateComponent;
