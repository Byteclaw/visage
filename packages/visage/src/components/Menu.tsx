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
  useRef,
  KeyboardEventHandler,
  forwardRef,
  RefObject,
  Ref,
} from 'react';
import {
  findNextFocusableElement,
  findPreviousFocusableElement,
  isFocusableElement,
  TransformOriginSettings,
} from './shared';
import { createComponent } from '../core';
import { useHandlerRef } from '../hooks';
import { List, ListItem } from './List';
import { Popover } from './Popover';

const MenuBase = createComponent(List, {
  displayName: 'Menu',
  styles: {
    backgroundColor: 'lightShades',
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
  anchor?: null | HTMLElement | RefObject<HTMLElement>;
  anchorOrigin?: TransformOriginSettings;
  baseRef?: RefObject<HTMLDivElement>;
  /**
   * Use only if you are managing focus outside of this component
   */
  disableAutoFocusItem?: boolean;
  disableEvents?: boolean;
  keepAnchorWidth?: boolean;
  onClose?: () => void;
  open: boolean;
  popoverProps?: OmittableProps<ExtractVisageComponentProps<typeof Popover>>;
}

type MenuItemProps = ExtractVisageComponentProps<typeof MenuItemBase>;

const defaultAnchorOrigin: TransformOriginSettings = {
  vertical: 'bottom',
  horizontal: 'left',
};

const popoverStyles = {
  boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
};

export function Menu({
  anchor,
  anchorOrigin = defaultAnchorOrigin,
  baseRef,
  children,
  disableAutoFocusItem,
  disableEvents,
  keepAnchorWidth,
  onClose,
  open,
  role = 'menu',
  onKeyDown: outerOnKeyDown,
  popoverProps,
  ...restProps
}: MenuProps) {
  const firstItemRef = useRef<HTMLElement | null>(null);
  const lastItemRef = useRef<HTMLElement | null>(null);
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
          e.preventDefault();
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
          e.preventDefault();
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
        }
      }
    },
    [disableEvents, outerOnKeyDown],
  );

  const onKeyDownPopover: KeyboardEventHandler<HTMLElement> = useHandlerRef(
    e => {
      if (e.currentTarget !== e.target || disableEvents) {
        return;
      }

      if (outerOnKeyDown) {
        outerOnKeyDown(e);
      }

      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault();

          if (lastItemRef.current) {
            const lastFocusable = isFocusableElement(lastItemRef.current)
              ? lastItemRef.current
              : findNextFocusableElement(lastItemRef.current);

            if (lastFocusable) {
              lastFocusable.focus();
            }
          }

          return;
        }
        case 'ArrowDown': {
          e.preventDefault();

          if (firstItemRef.current) {
            const firstFocusable = isFocusableElement(firstItemRef.current)
              ? firstItemRef.current
              : findNextFocusableElement(firstItemRef.current);

            if (firstFocusable) {
              firstFocusable.focus();
            }
          }
        }
      }
    },
  );

  // manage autofocus of first item
  // if not managed from outside
  useEffect(() => {
    if (!open || disableAutoFocusItem || disableEvents) {
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
  }, [open, disableAutoFocusItem, disableEvents]);

  return (
    <Popover
      alwaysVisible
      anchor={anchor}
      anchorOrigin={anchorOrigin}
      autoFocus={!disableEvents && disableAutoFocusItem}
      onKeyDown={
        !disableEvents && disableAutoFocusItem ? onKeyDownPopover : undefined
      }
      backdrop
      keepAnchorWidth={keepAnchorWidth}
      onClose={onClose}
      open={open}
      styles={popoverStyles}
      {...popoverProps}
    >
      <MenuBase ref={baseRef} role={role} {...restProps} tabIndex={-1}>
        {Children.map(children, (menuItem, i) => {
          return cloneElement(menuItem as any, {
            ref: i === 0 ? firstItemRef : lastItemRef,
            role: !open ? 'none' : (menuItem as any).props.role,
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
) as any;

MenuItem.displayName = 'MenuItem';

markAsVisageComponent(MenuItem);
