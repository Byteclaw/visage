import React from 'react';
import { PreviousPageIcon, NextPageIcon } from '../assets';
import { createComponent } from '../core';
import { Button } from './Button';
import { Flex } from './Flex';
import { SvgIcon } from './SvgIcon';

export const NextPageButton = createComponent(Button, {
  displayName: 'NextPageButton',
  defaultProps: {
    children: (
      <SvgIcon
        aria-hidden
        icon={NextPageIcon}
        styles={{ width: '1em', height: '1em' }}
      />
    ),
    type: 'button',
  },
});

export const PreviousPageButton = createComponent(Button, {
  displayName: 'PreviousPageButton',
  defaultProps: {
    children: (
      <SvgIcon
        aria-hidden
        icon={PreviousPageIcon}
        styles={{ width: '1em', height: '1em' }}
      />
    ),
    type: 'button',
  },
});

export const Pagination = createComponent(Flex, {
  displayName: 'Pagination',
  defaultProps: {
    ariaLabel: 'pagination',
    as: 'nav',
  },
  defaultStyles: {
    justifyContent: 'flex-start',
  },
});
