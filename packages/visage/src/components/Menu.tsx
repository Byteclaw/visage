import {
  ExtractVisageComponentProps,
  OmittableProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  KeyboardEventHandler,
  forwardRef,
  RefObject,
  Ref,
} from 'react';
import {
  findNextMatchingSiblingElement,
  findPreviousMatchingSiblingElement,
  PlacementWithAnchorOrigin,
  Placement,
} from './shared';
import { createComponent } from '../core';
import { useCombinedRef } from '../hooks';
import { List, ListItem } from './List';
import { Popover } from './Popover';

const MenuBase = createComponent(List, {
  displayName: 'Menu',
  styles: {
    backgroundColor: 'shades',
  },
});

const MenuItemBase = createComponent(ListItem, {
  displayName: 'MenuItem',
  styles: {
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
  anchor?: null | RefObject<HTMLElement>;
  /**
   * A ref to base HTML element
   */
  baseRef?: RefObject<HTMLDivElement>;
  /**
   * Use only if you are managing focus outside of this component
   */
  disableAutoFocusItem?: boolean;
  /**
   * Disable all default event handlers on menu?
   *
   * The purpose of this props is for example if you want to use Menu as companion to TextInput
   */
  disableEvents?: boolean;
  /**
   * Make menu as long as anchor element?
   */
  keepAnchorWidth?: boolean;
  onClose?: () => void;
  /**
   * Is menu open?
   */
  open?: boolean;
  /**
   * A responsive array of prioritized placements
   *
   * Can be used to say how should popover behave in different scenarios
   *
   * Default is top left placement with top left anchor origin and bottom left alternative
   */
  placement?: (PlacementWithAnchorOrigin[] | undefined)[];
  /**
   * Props that will be passed to underlying Popover component
   */
  popoverProps?: OmittableProps<ExtractVisageComponentProps<typeof Popover>>;
}

type MenuItemProps = ExtractVisageComponentProps<typeof MenuItemBase>;

const defaultPlacement: PlacementWithAnchorOrigin[][] = [
  [
    { placement: Placement.topLeft, vertical: 'bottom', horizontal: 'left' },
    {
      placement: Placement.bottomLeft,
      vertical: 'top',
      horizontal: 'left',
    },
  ],
];

const popoverStyles = {
  boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
};

const isMenuItemElement = (el: HTMLElement) =>
  el.getAttribute('role') === 'menuitem';

export function Menu({
  anchor,
  baseRef,
  children,
  disableAutoFocusItem,
  disableEvents,
  keepAnchorWidth,
  onClose,
  open = false,
  placement = defaultPlacement,
  role = 'menu',
  onKeyDown: outerOnKeyDown,
  popoverProps,
  ...restProps
}: MenuProps) {
  const menuRef = useCombinedRef(baseRef);
  const onKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(
    e => {
      if (outerOnKeyDown) {
        outerOnKeyDown(e);
      }

      if (disableEvents) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp': {
          // prevent so Popover onKeyDown is not called
          e.stopPropagation();
          e.preventDefault();
          // find previous focusable element, if none is found, find the last one
          const previousFocusableElement = findPreviousMatchingSiblingElement(
            e.currentTarget as HTMLElement,
            isMenuItemElement,
          );

          if (previousFocusableElement) {
            previousFocusableElement.focus();
            return;
          }
          if (menuRef.current) {
            // focus last
            menuRef.current
              .querySelector<HTMLElement>('[role="menuitem"]:last-of-type')
              ?.focus();
          }

          return;
        }
        case 'ArrowDown': {
          // prevent so Popover onKeyDown is not called
          e.stopPropagation();
          e.preventDefault();
          // find next focusable element, if none is found, find the first one
          const nextFocusableElement = findNextMatchingSiblingElement(
            e.currentTarget as HTMLElement,
            isMenuItemElement,
          );

          if (nextFocusableElement) {
            nextFocusableElement.focus();
          } else if (menuRef.current) {
            // focus first
            menuRef.current
              .querySelector<HTMLElement>('[role="menuitem"]:first-of-type')
              ?.focus();
          }
        }
      }
    },
    [disableEvents, outerOnKeyDown],
  );

  const onPopoverKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(
    e => {
      if (disableEvents) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault();

          // focus last menu item
          if (menuRef.current) {
            menuRef.current
              .querySelector<HTMLElement>('[role="menuitem"]:last-of-type')
              ?.focus();
          }

          return;
        }
        case 'ArrowDown': {
          e.preventDefault();

          // focus first menu item
          if (menuRef.current) {
            menuRef.current
              .querySelector<HTMLElement>('[role="menuitem"]:first-of-type')
              ?.focus();
          }
        }
      }
    },
    [disableEvents],
  );

  // manage autofocus of first item
  // if not managed from outside
  useEffect(() => {
    if (!open || disableAutoFocusItem || disableEvents) {
      return;
    }

    if (menuRef.current) {
      const firstMenuItem = menuRef.current.querySelector<HTMLElement>(
        '[role="menuitem"]:first-of-type',
      );

      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }
  }, [open, disableAutoFocusItem, disableEvents]);

  return (
    <Popover
      anchor={anchor}
      autoFocus={!disableEvents && disableAutoFocusItem}
      backdrop
      keepAnchorWidth={keepAnchorWidth}
      onClose={onClose}
      onKeyDown={onPopoverKeyDown}
      open={open}
      placement={placement}
      minHeight={150}
      {...popoverProps}
      styles={{
        ...popoverStyles,
        ...popoverProps?.styles,
      }}
    >
      <MenuBase ref={menuRef} role={role} {...restProps} tabIndex={-1}>
        {Children.map(children, menuItem => {
          return cloneElement(menuItem as any, {
            onKeyDown,
          });
        })}
      </MenuBase>
    </Popover>
  );
}

export const MenuItem: typeof MenuItemBase = forwardRef(
  (
    { children, role = 'menuitem', ...restProps }: MenuItemProps,
    ref: Ref<HTMLLIElement>,
  ) => {
    // https://www.w3.org/TR/wai-aria-practices-1.1/#wai-aria-roles-states-and-properties-13
    return (
      <MenuItemBase tabIndex={-1} role={role} ref={ref} {...restProps}>
        {children}
      </MenuItemBase>
    );
  },
) as any;

MenuItem.displayName = 'MenuItem';

markAsVisageComponent(MenuItem);
