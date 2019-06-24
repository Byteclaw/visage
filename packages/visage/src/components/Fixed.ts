import { createComponent } from '../core';
import { Box } from './Box';

export const Fixed = createComponent(Box, {
  displayName: 'Fixed',
  defaultStyles: {
    position: 'fixed',
  },
});
