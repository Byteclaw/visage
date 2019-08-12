import React, { ReactNode, MouseEvent, KeyboardEvent } from 'react';

import { createComponent } from '@byteclaw/visage-core';
import { List, ListItem } from './List';

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
});

interface MenuProps {
  children?: ReactNode;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  role?: 'listbox';
}

interface MenuItemProps {
  children?: ReactNode;
  role?: 'listbox-option';
}

export function Menu({ children, role = 'listbox' }: MenuProps) {
  return <MenuBase role={role}>{children}</MenuBase>;
}

export function MenuItem({ children, role = 'listbox-option' }: MenuItemProps) {
  return <MenuItemBase role={role}>{children}</MenuItemBase>;
}
