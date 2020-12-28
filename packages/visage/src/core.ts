import {
  createTheme as baseCreateTheme,
  CreateThemeFactory,
} from '@byteclaw/visage-core';
import { VisageFaces } from './faces';

// augment style sheet
import './stylesheet';

export { createComponent } from '@byteclaw/visage-core';

export const createTheme: CreateThemeFactory<VisageFaces> = baseCreateTheme;
