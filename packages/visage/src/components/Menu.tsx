import {
  createComponent,
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
import React, {
  Children,
  cloneElement,
  ReactNode,
  Ref,
  MouseEvent,
  KeyboardEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  KeyboardEventHandler,
  forwardRef,
} from 'react';

import { StyleProps } from '../createNPointTheme';
import {
  findNextFocusableElement,
  findPreviousFocusableElement,
  isFocusableElement,
} from './shared';
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
    '&:hover, &:focus, &[aria-selected="true"]': {
      outline: 'none',
      backgroundColor: 'primary.1',
      color: 'primaryText.1',
      cursor: 'pointer',
      userSelect: 'none',
    },
  },
});

interface MenuProps extends ExtractVisageComponentProps<typeof MenuBase> {
  anchor?: null | Ref<HTMLElement> | EventTarget;
  anchorOrigin?: {
    vertical: 'bottom' | 'center' | 'top' | number;
    horizontal: 'left' | 'center' | 'right' | number;
  };
  children?: ReactNode;
  /**
   * Use only if you are managing focus outside of this component
   */
  disableEvents?: boolean;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  open: boolean;
}

interface MenuItemProps
  extends ExtractVisageComponentProps<typeof MenuItemBase> {
  children?: ReactNode;
}

export function Menu({
  anchor,
  children,
  disableEvents,
  onClose,
  open,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  role = 'menu',
  onKeyDown: outerOnKeyDown,
  ...restProps
}: MenuProps) {
  const firstItemRef = useRef<HTMLElement | null>(null);
  const lastItemRef = useRef<HTMLElement | null>(null);
  const onKeyDown: KeyboardEventHandler = useCallback(
    e => {
      if (outerOnKeyDown) {
        outerOnKeyDown(e);
      }

      // if menu is managed from outside, ignore events
      if (disableEvents) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp': {
          // find previous focusable element, if none is found, find the last one
          const previousFocusableElement = findPreviousFocusableElement(
            e.currentTarget as HTMLElement,
          );

          if (previousFocusableElement) {
            previousFocusableElement.focus();
            return;
          }

          if (lastItemRef.current) {
            const focusableElement = isFocusableElement(lastItemRef.current)
              ? lastItemRef.current
              : findNextFocusableElement(lastItemRef.current);

            if (focusableElement && focusableElement !== e.currentTarget) {
              focusableElement.focus();
            }
          }

          return;
        }
        case 'ArrowDown': {
          // find next focusable element, if none is found, find the first one
          const nextFocusableElement = findNextFocusableElement(
            e.currentTarget as HTMLElement,
          );

          if (nextFocusableElement) {
            nextFocusableElement.focus();
            return;
          }

          if (firstItemRef.current) {
            const focusableElement = isFocusableElement(firstItemRef.current)
              ? firstItemRef.current
              : findNextFocusableElement(firstItemRef.current);

            if (focusableElement && focusableElement !== e.currentTarget) {
              focusableElement.focus();
            }
          }

          return;
        }
        case 'Escape': {
          if (onClose) {
            onClose(e);
          }
        }
      }
    },
    [disableEvents, outerOnKeyDown, onClose],
  );

  // manage autofocus of first item
  // if not managed from outside
  useLayoutEffect(() => {
    if (!open || disableEvents) {
      return;
    }

    if (firstItemRef.current) {
      const firstFocusable = isFocusableElement(firstItemRef.current)
        ? firstItemRef.current
        : findNextFocusableElement(firstItemRef.current);

      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [open, disableEvents]);

  return (
    <Popover
      anchor={anchor}
      anchorOrigin={anchorOrigin}
      autoFocus={false}
      onClose={onClose}
      open={open}
    >
      <MenuBase role={role} {...restProps} tabIndex={-1}>
        {Children.map(children, (menuItem, i) => {
          return cloneElement(menuItem as any, {
            ref: i === 0 ? firstItemRef : lastItemRef,
            role: !open
              ? 'none'
              : typeof menuItem !== 'string'
              ? (menuItem as any).props.role
              : undefined,
            onKeyDown,
          });
        })}
      </MenuBase>
    </Popover>
  );
}

export const MenuItem: VisageComponent<MenuItemProps, StyleProps> = forwardRef(
  ({ children, role = 'menuitem', ...restProps }: MenuItemProps, ref) => {
    return (
      <MenuItemBase
        tabIndex={role === 'menuitem' ? 0 : -1}
        role={role}
        ref={ref}
        {...restProps}
      >
        {children}
      </MenuItemBase>
    );
  },
);

markAsVisageComponent(MenuItem);
