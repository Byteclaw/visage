import React, { ReactNode, Ref, MouseEvent, KeyboardEvent } from 'react';

import { createComponent } from '@byteclaw/visage-core';
import { List, ListItem } from './List';
import { Popover } from './Popover';

const MenuBase = createComponent(List, {
  displayName: 'MenuBase',
  defaultStyles: {
    maxHeight: ['100vh', 'calc(100vh - 32px)'],
    maxWidth: ['100vw', 'calc(100vw - 32px)'],
    overflowY: 'scroll',
  },
});

const MenuItemBase = createComponent(ListItem, {
  displayName: 'MenuItemBase',
  defaultStyles: {
    '&[role="listbox-option"]:hover, &[role="listbox-option"]:focus': {
      outline: 'none',
      backgroundColor: 'primary.1',
      color: 'primaryText.1',
      cursor: 'pointer',
      userSelect: 'none',
    },
  },
});

interface MenuProps {
  anchor?: null | Ref<HTMLElement> | EventTarget;
  anchorOrigin?: {
    vertical: 'bottom' | 'center' | 'top' | number;
    horizontal: 'left' | 'center' | 'right' | number;
  };
  children?: ReactNode;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  open: boolean;
  role?: 'listbox';
}

interface MenuItemProps {
  children?: ReactNode;
  role?: 'listbox-option';
}

export function Menu({
  anchor,
  children,
  onClose,
  open,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  role = 'listbox',
}: MenuProps) {
  return (
    <Popover
      anchor={anchor}
      anchorOrigin={anchorOrigin}
      onClose={onClose}
      open={open}
    >
      <MenuBase role={role}>{children}</MenuBase>
    </Popover>
  );
}

export function MenuItem({ children, role = 'listbox-option' }: MenuItemProps) {
  return (
    <MenuItemBase tabIndex={0} role={role}>
      {children}
    </MenuItemBase>
  );
}
