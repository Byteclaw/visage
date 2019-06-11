import { createComponent, createVariant } from '../core';

const HeadingBase = createComponent('h1', {
  displayName: 'HeadingBase',
  defaultStyles: {
    fontFamily: 'heading',
  },
});

export const Heading = createVariant(
  HeadingBase,
  'level',
  {
    1: {
      fontSize: 4,
      lineHeight: 4,
      mt: 2,
      mb: 1,
      fontWeight: 'normal',
    },
    2: {
      fontSize: 3,
      lineHeight: 3,
      mt: 1,
      mb: 1,
      fontWeight: 'normal',
    },
    3: {
      fontSize: 2,
      lineHeight: 2,
      mt: 1,
      mb: 1,
      fontWeight: 'normal',
    },
    4: {
      fontSize: 1,
      lineHeight: 1,
      mt: 1,
      mb: 1,
      fontWeight: 'normal',
    },
    5: {
      fontSize: 0,
      lineHeight: 0,
      fontWeight: 'normal',
      mt: 1,
      mb: 1,
    },
    default: {
      fontSize: 0,
      lineHeight: 0,
      fontWeight: 'normal',
      fontStyle: 'italic',
      mt: 1,
      mb: 1,
    },
  },
  1,
);
