import React from 'react';
import { PreviousPageIcon, NextPageIcon } from '../assets';
import { createComponent } from '../core';
import { Button } from './Button';
import { SvgIcon } from './SvgIcon';

export const PaginationNextPageButton = createComponent(Button, {
  displayName: 'PaginationNextPageButton',
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

export const PaginationPreviousPageButton = createComponent(Button, {
  displayName: 'PaginationPreviousPageButton',
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

export const Pagination = createComponent('nav', {
  displayName: 'Pagination',
  defaultProps: {
    'aria-label': 'pagination',
  },
  styles: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});
