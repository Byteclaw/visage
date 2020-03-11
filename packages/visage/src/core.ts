import {
  ComponentFactory,
  createComponent as baseCreateComponent,
  createTheme as baseCreateTheme,
  CreateThemeFactory,
} from '@byteclaw/visage-core';
import { VisageFaces } from './faces';

// augment style sheet
import './stylesheet';

// @TODO get rid of this and write proper generic in core
export const createComponent: ComponentFactory = baseCreateComponent;
export const createTheme: CreateThemeFactory<
  VisageStylingProperties,
  VisageFaces
> = baseCreateTheme;
